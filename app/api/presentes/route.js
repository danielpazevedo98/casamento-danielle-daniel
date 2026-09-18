import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cartaoAtivo } from "@/lib/mercadopago";
import { liberarReservasVencidas, presentesOcupados } from "@/lib/reservas";

export const dynamic = "force-dynamic";

const CAMPOS = "id, nome, descricao, preco, categoria, emoji, imagem_url";

// Lista publica: presentes publicados que ninguem escolheu ainda.
// ?id=N devolve um presente so, dizendo se ja foi escolhido.
export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");
  const db = supabaseAdmin();

  try {
    await liberarReservasVencidas(db);
    const ocupados = await presentesOcupados(db);

    if (id) {
      const { data, error } = await db
        .from("gifts").select(CAMPOS).eq("id", id).eq("publicado", true).maybeSingle();
      if (error) throw error;
      if (!data) return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
      return NextResponse.json({ presente: data, escolhido: ocupados.has(data.id), cartao: cartaoAtivo() });
    }

    const { data, error } = await db
      .from("gifts").select(CAMPOS).eq("publicado", true).order("preco").order("nome");
    if (error) throw error;
    return NextResponse.json({ presentes: data.filter((p) => !ocupados.has(p.id)), cartao: cartaoAtivo() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
