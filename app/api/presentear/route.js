import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { pixCopiaECola, recebedorPix } from "@/lib/pix";
import { cartaoAtivo, criarPreferencia } from "@/lib/mercadopago";
import { REPETIDO, RESERVA_MINUTOS, liberarReservasVencidas, novoCodigo } from "@/lib/reservas";

export const dynamic = "force-dynamic";

const texto = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// O convidado escolheu um presente: reserva (ele some do site) e devolve o Pix
// (QR Code + copia e cola) ou o link de pagamento do Mercado Pago.
export async function POST(request) {
  const corpo = await request.json().catch(() => ({}));
  const nome = texto(corpo.nome, 120);
  const email = texto(corpo.email, 160);
  const mensagem = texto(corpo.mensagem, 1000);
  const metodo = corpo.metodo;

  if (!nome) return NextResponse.json({ error: "Diga seu nome" }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  if (metodo !== "pix" && metodo !== "cartao")
    return NextResponse.json({ error: "Forma de pagamento inválida" }, { status: 400 });
  if (metodo === "pix" && !recebedorPix().chave)
    return NextResponse.json({ error: "O Pix ainda não está configurado. Avise os noivos!" }, { status: 500 });
  if (metodo === "cartao" && !cartaoAtivo())
    return NextResponse.json({ error: "Pagamento por cartão ainda não está disponível" }, { status: 400 });

  const db = supabaseAdmin();
  await liberarReservasVencidas(db);
  const { data: presente } = await db
    .from("gifts").select("id, nome, preco").eq("id", corpo.giftId).eq("publicado", true).maybeSingle();
  if (!presente) return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });

  const { data: claim, error } = await db
    .from("gift_claims")
    .insert({
      codigo: novoCodigo(),
      gift_id: presente.id,
      presente_nome: presente.nome,
      nome,
      email: email || null,
      mensagem: mensagem || null,
      valor: presente.preco,
      metodo,
    })
    .select()
    .single();
  // O indice unico do banco recusa se alguem escolheu este presente antes.
  if (error?.code === REPETIDO) {
    return NextResponse.json(
      { error: "Poxa, alguém acabou de escolher esse presente! Que tal outro?", escolhido: true },
      { status: 409 }
    );
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (metodo === "cartao") {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    try {
      const url = await criarPreferencia({ claim, siteUrl });
      return NextResponse.json({ url });
    } catch (e) {
      await db.from("gift_claims").update({ status: "cancelado" }).eq("id", claim.id);
      return NextResponse.json({ error: "Não consegui abrir o pagamento. Tente o Pix?" }, { status: 502 });
    }
  }

  const recebedor = recebedorPix();
  const copiaECola = pixCopiaECola({
    chave: recebedor.chave,
    nome: recebedor.nome,
    cidade: recebedor.cidade,
    valor: presente.preco,
    txid: claim.codigo,
    descricao: "Casamento Danielle e Daniel",
  });
  const qr = await QRCode.toDataURL(copiaECola, {
    margin: 1,
    width: 480,
    color: { dark: "#5a2e2e", light: "#ffffff" },
  });

  return NextResponse.json({
    codigo: claim.codigo,
    valor: claim.valor,
    reservaMinutos: RESERVA_MINUTOS,
    pix: { copiaECola, qr, chave: recebedor.chave, banco: recebedor.banco },
  });
}
