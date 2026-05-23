import { MercadoPagoConfig, Preference } from "mercadopago";

export function mpClient() {
  return new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
  });
}

export async function createGiftPreference({ gift, buyer, siteUrl }) {
  const client = mpClient();
  const pref = new Preference(client);
  const result = await pref.create({
    body: {
      items: [
        {
          id: gift.id,
          title: `Presente de casamento — ${gift.name}`,
          quantity: 1,
          unit_price: Number(gift.price),
          currency_id: "BRL",
        },
      ],
      payer: {
        name: buyer.name,
        email: buyer.email,
      },
      back_urls: {
        success: `${siteUrl}/pagamento/sucesso?gift=${gift.id}&buyer=${encodeURIComponent(buyer.name)}&email=${encodeURIComponent(buyer.email)}`,
        failure: `${siteUrl}/pagamento/falha`,
        pending: `${siteUrl}/pagamento/pendente`,
      },
      auto_return: "approved",
      external_reference: gift.id,
      statement_descriptor: "CasamentoDD",
    },
  });
  return result;
}
