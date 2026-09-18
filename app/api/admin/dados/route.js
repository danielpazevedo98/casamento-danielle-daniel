import { supabaseAdmin } from "@/lib/supabase";
import { exigirAdmin } from "@/lib/adminAuth";
import { falha, ok } from "@/lib/adminApi";
import { liberarReservasVencidas } from "@/lib/reservas";

export const dynamic = "force-dynamic";

// Tudo o que o painel precisa, numa chamada so.
export async function GET(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;

  const db = supabaseAdmin();
  await liberarReservasVencidas(db);
  const [c, g, p, cl] = await Promise.all([
    db.from("guests").select("*").order("nome"),
    db.from("guest_groups").select("*").order("id"),
    db.from("gifts").select("*").order("preco").order("nome"),
    db.from("gift_claims").select("*").order("criado_em", { ascending: false }),
  ]);
  const erro = c.error || g.error || p.error || cl.error;
  if (erro) return falha(erro);
  return ok({ convidados: c.data, grupos: g.data, presentes: p.data, claims: cl.data });
}
