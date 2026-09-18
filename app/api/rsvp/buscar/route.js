import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizar } from "@/lib/formato";

export const dynamic = "force-dynamic";

// So entram na busca os convidados "Verde" que ainda nao responderam: cada
// pessoa confirma uma vez so. A dica "com Fulano" ajuda a diferenciar nomes iguais.
export async function GET(request) {
  const q = normalizar(new URL(request.url).searchParams.get("q")).trim();
  if (q.length < 2) return NextResponse.json([]);

  const { data, error } = await supabaseAdmin()
    .from("guests").select("id, nome, grupo_id, presenca").eq("lista", "Verde").order("nome");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const achados = data
    .filter((c) => !c.presenca && normalizar(c.nome).includes(q))
    .slice(0, 6)
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      com: c.grupo_id
        ? data.filter((x) => x.grupo_id === c.grupo_id && x.id !== c.id).slice(0, 2).map((x) => x.nome)
        : [],
    }));
  return NextResponse.json(achados);
}
