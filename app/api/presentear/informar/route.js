import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { REPETIDO } from "@/lib/reservas";

export const dynamic = "force-dynamic";

// O convidado clicou em "Já fiz o Pix". O presente continua reservado ate os
// noivos conferirem no banco, e o admin mostra que a pessoa avisou.
export async function POST(request) {
  const { codigo } = await request.json().catch(() => ({}));
  if (typeof codigo !== "string" || !codigo) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }
  const db = supabaseAdmin();
  const { data: claim } = await db
    .from("gift_claims").select("id, status").eq("codigo", codigo).eq("metodo", "pix").maybeSingle();
  if (!claim || !["pendente", "expirado"].includes(claim.status)) return NextResponse.json({ ok: true });

  // Se a reserva ja tinha vencido (pagou depois do prazo), reativa. Se nesse meio
  // tempo outra pessoa escolheu o mesmo presente, guarda o Pix sem vincular ao item.
  const mudanca = { status: "pendente", informado_em: new Date().toISOString() };
  let { error } = await db.from("gift_claims").update(mudanca).eq("id", claim.id);
  if (error?.code === REPETIDO) {
    ({ error } = await db.from("gift_claims").update({ ...mudanca, gift_id: null }).eq("id", claim.id));
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
