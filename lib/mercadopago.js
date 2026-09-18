import crypto from "crypto";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabase";
import { REPETIDO, RESERVA_MINUTOS } from "@/lib/reservas";

// O botao de cartao so aparece quando a conta do Mercado Pago estiver configurada.
export const cartaoAtivo = () => Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);

const cliente = () => new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

export async function criarPreferencia({ claim, siteUrl }) {
  const pref = await new Preference(cliente()).create({
    body: {
      items: [
        {
          id: String(claim.gift_id ?? claim.id),
          title: `Presente de casamento: ${claim.presente_nome}`.slice(0, 250),
          quantity: 1,
          unit_price: Number(claim.valor),
          currency_id: "BRL",
        },
      ],
      payer: { name: claim.nome, ...(claim.email ? { email: claim.email } : {}) },
      external_reference: claim.id,
      back_urls: {
        success: `${siteUrl}/pagamento/sucesso?metodo=cartao`,
        pending: `${siteUrl}/pagamento/pendente`,
        failure: `${siteUrl}/pagamento/falha`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      statement_descriptor: "CASAMENTO DD",
      // O link de pagamento vence um pouco antes da reserva do presente.
      expires: true,
      expiration_date_to: new Date(Date.now() + (RESERVA_MINUTOS - 5) * 60000).toISOString(),
      // So cartao: boleto demora dias e Pix os convidados ja fazem direto, sem taxa.
      payment_methods: { excluded_payment_types: [{ id: "ticket" }, { id: "atm" }, { id: "bank_transfer" }] },
    },
  });
  return pref.init_point;
}

// Le o pagamento direto na API do Mercado Pago (fonte da verdade) e atualiza o
// presente correspondente. Usado pelo webhook e pela pagina de sucesso.
export async function sincronizarPagamento(paymentId) {
  const pag = await new Payment(cliente()).get({ id: paymentId });
  const claimId = pag.external_reference;
  if (!claimId) return { status: pag.status };

  // Cartao recusado nao muda nada: a pessoa pode tentar de novo, e se desistir
  // a reserva vence sozinha e o presente volta para a lista.
  let mudanca = null;
  if (pag.status === "approved") {
    mudanca = { status: "confirmado", confirmado_em: pag.date_approved || new Date().toISOString() };
  } else if (["in_process", "pending", "authorized"].includes(pag.status)) {
    mudanca = { status: "pendente" };
  } else if (["refunded", "charged_back", "cancelled"].includes(pag.status)) {
    mudanca = { status: "cancelado" };
  }
  if (!mudanca) return { status: pag.status };
  mudanca.mp_payment_id = String(pag.id);

  const db = supabaseAdmin();
  const atualizar = (m) => db.from("gift_claims").update(m).eq("id", claimId).eq("metodo", "cartao");
  let { error } = await atualizar(mudanca);
  // Pagou depois de a reserva vencer e alguem ja pegou o presente: o dinheiro
  // entra do mesmo jeito, so que sem vincular ao item da lista.
  if (error?.code === REPETIDO) ({ error } = await atualizar({ ...mudanca, gift_id: null }));
  if (error) throw error;
  return { status: pag.status };
}

// Confere a assinatura x-signature do webhook. Sem MERCADOPAGO_WEBHOOK_SECRET configurado,
// aceita: o pagamento e sempre relido na API do Mercado Pago de qualquer forma.
export function assinaturaValida(request, dataId) {
  const segredo = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!segredo) return true;
  const assinatura = request.headers.get("x-signature") || "";
  const requestId = request.headers.get("x-request-id") || "";
  const partes = Object.fromEntries(assinatura.split(",").map((p) => p.trim().split("=")));
  if (!partes.ts || !partes.v1) return false;
  const manifesto = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${partes.ts};`;
  const esperado = crypto.createHmac("sha256", segredo).update(manifesto).digest("hex");
  return (
    esperado.length === partes.v1.length &&
    crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(partes.v1))
  );
}
