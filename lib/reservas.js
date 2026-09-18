import crypto from "crypto";

// Cada presente so pode ser dado uma vez. Ao escolher, o presente fica
// reservado e some do site. Se a pessoa gerar o Pix e nao avisar que pagou
// dentro do prazo abaixo, a reserva vence e o presente volta para a lista.
// Quem clicou em "Ja fiz o Pix" continua reservado ate os noivos conferirem.
export const RESERVA_MINUTOS = 60;

// Estados que seguram o presente. O banco tambem garante isso (indice unico
// gift_claims_um_por_presente), entao duas pessoas nunca pegam o mesmo.
export const OCUPA = ["pendente", "confirmado"];

// Codigo de erro do Postgres para "valor repetido" (o indice unico acima).
export const REPETIDO = "23505";

export async function liberarReservasVencidas(db) {
  const limite = new Date(Date.now() - RESERVA_MINUTOS * 60000).toISOString();
  await db
    .from("gift_claims")
    .update({ status: "expirado" })
    .eq("status", "pendente")
    .is("informado_em", null)
    .is("mp_payment_id", null)
    .lt("criado_em", limite);
}

export async function presentesOcupados(db) {
  const { data, error } = await db
    .from("gift_claims").select("gift_id").in("status", OCUPA).not("gift_id", "is", null);
  if (error) throw error;
  return new Set(data.map((c) => c.gift_id));
}

// Codigo curto que vai no txid do Pix, para achar o presente no extrato.
export function novoCodigo() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "DD" + Array.from(crypto.randomBytes(8), (b) => letras[b % letras.length]).join("");
}
