import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Grava as respostas Vai / Nao vai. O servidor confere que todos sao do mesmo
// grupo, estao "Verde" e ainda nao responderam, para ninguem alterar a
// resposta de outra pessoa pelo site.
export async function POST(request) {
  const corpo = await request.json().catch(() => ({}));
  const respostas = Array.isArray(corpo.respostas) ? corpo.respostas : [];
  const confirmadoPor = typeof corpo.confirmadoPor === "string" ? corpo.confirmadoPor.trim().slice(0, 120) : "";

  if (!respostas.length || respostas.length > 20)
    return NextResponse.json({ error: "Marque Vai ou Não vai para pelo menos uma pessoa" }, { status: 400 });
  if (!confirmadoPor)
    return NextResponse.json({ error: "Diga quem está preenchendo a confirmação" }, { status: 400 });
  if (respostas.some((r) => !Number.isInteger(r.id) || !["vai", "nao_vai"].includes(r.presenca)))
    return NextResponse.json({ error: "Resposta inválida" }, { status: 400 });

  const db = supabaseAdmin();
  const ids = respostas.map((r) => r.id);
  const { data: pessoas, error } = await db
    .from("guests").select("id, grupo_id, lista, presenca").in("id", ids);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const grupos = new Set(pessoas.map((p) => p.grupo_id));
  const valido =
    pessoas.length === ids.length &&
    pessoas.every((p) => p.lista === "Verde" && !p.presenca) &&
    (ids.length === 1 || (grupos.size === 1 && !grupos.has(null)));
  if (!valido) {
    return NextResponse.json(
      { error: "Alguém dessa lista já respondeu. Recarregue a página e tente de novo." },
      { status: 409 }
    );
  }

  const agora = new Date().toISOString();
  let falhas = 0;
  for (const r of respostas) {
    const { error: e } = await db
      .from("guests")
      .update({ presenca: r.presenca, rsvp_em: agora, confirmado_por: confirmadoPor })
      .eq("id", r.id)
      .is("presenca", null);
    if (e) falhas++;
  }
  if (falhas) return NextResponse.json({ error: "Não consegui salvar tudo. Tente de novo, por favor" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
