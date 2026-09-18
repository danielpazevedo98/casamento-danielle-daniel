import { supabaseAdmin } from "@/lib/supabase";
import { exigirAdmin } from "@/lib/adminAuth";
import { escolher, falha, lerCorpo, ok } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

const CAMPOS = ["nome", "origem", "categoria", "lista", "grupo_id", "presenca", "rsvp_em", "confirmado_por"];

export async function POST(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const { error } = await supabaseAdmin().from("guests").insert(escolher(await lerCorpo(request), CAMPOS));
  return error ? falha(error) : ok();
}

export async function PATCH(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const corpo = await lerCorpo(request);
  const { error } = await supabaseAdmin().from("guests").update(escolher(corpo, CAMPOS)).eq("id", corpo.id);
  return error ? falha(error) : ok();
}

export async function DELETE(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const id = new URL(request.url).searchParams.get("id");
  const { error } = await supabaseAdmin().from("guests").delete().eq("id", id);
  return error ? falha(error) : ok();
}
