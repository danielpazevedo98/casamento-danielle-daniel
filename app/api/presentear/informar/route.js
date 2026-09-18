import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// O convidado clicou em "Já fiz o Pix". Continua pendente ate os noivos
// conferirem no banco, mas o admin passa a mostrar que ele avisou.
export async function POST(request) {
  const { codigo } = await request.json().catch(() => ({}));
  if (typeof codigo !== "string" || !codigo) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }
  const { error } = await supabaseAdmin()
    .from("gift_claims")
    .update({ informado_em: new Date().toISOString() })
    .eq("codigo", codigo)
    .eq("metodo", "pix")
    .eq("status", "pendente")
    .is("informado_em", null);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
