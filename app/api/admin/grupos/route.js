import { supabaseAdmin } from "@/lib/supabase";
import { exigirAdmin } from "@/lib/adminAuth";
import { falha, ok } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

// Cria o proximo grupo (numero seguinte ao maior que existe).
export async function POST(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const db = supabaseAdmin();
  const { data: ultimo } = await db.from("guest_groups").select("id").order("id", { ascending: false }).limit(1).maybeSingle();
  const id = (ultimo?.id || 0) + 1;
  const { error } = await db.from("guest_groups").insert({ id, nome: `Grupo ${id}` });
  return error ? falha(error) : ok({ id });
}
