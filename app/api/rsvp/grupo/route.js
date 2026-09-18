import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Quem ainda pode ser confirmado junto com o convidado escolhido na busca
// (ele mesmo incluso). Convidado sem grupo confirma so a si mesmo.
export async function GET(request) {
  const id = Number(new URL(request.url).searchParams.get("convidado"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Convidado inválido" }, { status: 400 });

  const db = supabaseAdmin();
  const { data: pessoa } = await db
    .from("guests").select("id, nome, grupo_id, presenca, lista").eq("id", id).maybeSingle();
  if (!pessoa || pessoa.lista !== "Verde" || pessoa.presenca) {
    return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 });
  }
  if (!pessoa.grupo_id) return NextResponse.json([{ id: pessoa.id, nome: pessoa.nome }]);

  const { data, error } = await db
    .from("guests").select("id, nome")
    .eq("grupo_id", pessoa.grupo_id).eq("lista", "Verde").is("presenca", null)
    .order("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
