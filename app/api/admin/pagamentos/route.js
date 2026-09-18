import { supabaseAdmin } from "@/lib/supabase";
import { exigirAdmin } from "@/lib/adminAuth";
import { falha, invalido, lerCorpo, ok } from "@/lib/adminApi";
import { REPETIDO, novoCodigo } from "@/lib/reservas";

export const dynamic = "force-dynamic";

const STATUS = ["pendente", "confirmado", "cancelado", "expirado"];
const METODOS = ["pix", "cartao", "outro"];

// Presente recebido fora do site (dinheiro no envelope, Pix direto na chave...).
export async function POST(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const corpo = await lerCorpo(request);
  const valor = Number(corpo.valor);
  const nome = typeof corpo.nome === "string" ? corpo.nome.trim() : "";
  if (!nome || !(valor > 0) || !METODOS.includes(corpo.metodo)) return invalido("Dados incompletos");

  const db = supabaseAdmin();
  let presente = null;
  if (corpo.gift_id) {
    ({ data: presente } = await db.from("gifts").select("id, nome").eq("id", corpo.gift_id).maybeSingle());
  }
  const agora = new Date().toISOString();
  const { error } = await db.from("gift_claims").insert({
    codigo: novoCodigo(),
    gift_id: presente?.id ?? null,
    presente_nome: presente?.nome || "Presente em dinheiro",
    nome,
    mensagem: corpo.mensagem?.trim() || null,
    valor,
    metodo: corpo.metodo,
    status: "confirmado",
    confirmado_em: agora,
  });
  return error ? falha(error, { [REPETIDO]: "Esse presente já foi escolhido por outra pessoa." }) : ok();
}

// Muda a situacao: confirmar recebimento, cancelar (libera o presente) ou voltar.
export async function PATCH(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;
  const { id, status } = await lerCorpo(request);
  if (!STATUS.includes(status)) return invalido("Situação inválida");

  const db = supabaseAdmin();
  const mudanca = { status, confirmado_em: status === "confirmado" ? new Date().toISOString() : null };
  let { error } = await db.from("gift_claims").update(mudanca).eq("id", id);
  // Reativando um presente que, enquanto isso, outra pessoa escolheu: guarda o
  // pagamento sem vincular ao item da lista.
  if (error?.code === REPETIDO) {
    ({ error } = await db.from("gift_claims").update({ ...mudanca, gift_id: null }).eq("id", id));
    if (!error) return ok({ aviso: "Esse presente já tinha sido escolhido por outra pessoa; o pagamento ficou registrado sem o item." });
  }
  return error ? falha(error) : ok();
}
