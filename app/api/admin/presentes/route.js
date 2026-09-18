import { supabaseAdmin } from "@/lib/supabase";
import { exigirAdmin } from "@/lib/adminAuth";
import { escolher, falha, lerCorpo, ok } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

const CAMPOS = ["nome", "descricao", "preco", "categoria", "emoji", "imagem_url", "publicado"];
const MENSAGENS = {
  23505: "Já existe um presente com esse nome.",
  23514: "O preço precisa ser um múltiplo de R$ 10.",
};

export async function POST(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const { error } = await supabaseAdmin().from("gifts").insert(escolher(await lerCorpo(request), CAMPOS));
  return error ? falha(error, MENSAGENS) : ok();
}

// { id, ...campos } altera um presente; { ids: [...], publicado } poe ou tira
// varios do site de uma vez.
export async function PATCH(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const corpo = await lerCorpo(request);
  const db = supabaseAdmin();
  const { error } = Array.isArray(corpo.ids)
    ? await db.from("gifts").update({ publicado: Boolean(corpo.publicado) }).in("id", corpo.ids)
    : await db.from("gifts").update(escolher(corpo, CAMPOS)).eq("id", corpo.id);
  return error ? falha(error, MENSAGENS) : ok();
}

export async function DELETE(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const id = new URL(request.url).searchParams.get("id");
  const { error } = await supabaseAdmin().from("gifts").delete().eq("id", id);
  return error ? falha(error) : ok();
}
