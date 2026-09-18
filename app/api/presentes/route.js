import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cartaoAtivo } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

const CAMPOS = "id, nome, descricao, preco, categoria, emoji, imagem_url";

// Lista publica: so presentes publicados. ?id=N devolve um presente so.
export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");
  const db = supabaseAdmin();

  if (id) {
    const { data, error } = await db
      .from("gifts").select(CAMPOS).eq("id", id).eq("publicado", true).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
    return NextResponse.json({ presente: data, cartao: cartaoAtivo() });
  }

  const { data, error } = await db
    .from("gifts").select(CAMPOS).eq("publicado", true)
    .order("preco").order("nome");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ presentes: data, cartao: cartaoAtivo() });
}
