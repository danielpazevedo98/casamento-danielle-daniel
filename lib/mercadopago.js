import crypto from "crypto";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { supabaseAdmin } from "@/lib/supabase";

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

  const db = supabaseAdmin();
  const mudanca = { mp_payment_id: String(pag.id) };
  if (pag.status === "approved") {
    mudanca.status = "confirmado";
    mudanca.confirmado_em = pag.date_approved || new Date().toISOString();
  } else if (["refunded", "charged_back", "cancelled"].includes(pag.status)) {
    mudanca.status = "cancelado";
  }
  const { error } = await db.from("gift_claims").update(mudanca).eq("id", claimId).eq("metodo", "cartao");
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
