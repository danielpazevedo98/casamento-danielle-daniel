import { NextResponse } from "next/server";
import { assinaturaValida, cartaoAtivo, sincronizarPagamento } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

// Aviso do Mercado Pago de que um pagamento mudou. O conteudo do aviso nao e
// usado: so o id, e o pagamento e relido na API do Mercado Pago.
export async function POST(request) {
  if (!cartaoAtivo()) return NextResponse.json({ ok: true });

  const url = new URL(request.url);
  const corpo = await request.json().catch(() => ({}));
  const tipo = url.searchParams.get("type") || corpo.type;
  const id = url.searchParams.get("data.id") || corpo?.data?.id;

  if (tipo !== "payment" || !id) return NextResponse.json({ ok: true });
  if (!assinaturaValida(request, id)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  try {
    await sincronizarPagamento(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[webhook mp]", e?.message || e);
    // 500 faz o Mercado Pago tentar de novo mais tarde.
    return NextResponse.json({ error: "Falha ao processar" }, { status: 500 });
  }
}
