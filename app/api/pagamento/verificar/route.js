import { NextResponse } from "next/server";
import { cartaoAtivo, sincronizarPagamento } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

// Chamado pela pagina de sucesso ao voltar do Mercado Pago. Garante que o
// presente seja confirmado mesmo se o webhook atrasar.
export async function GET(request) {
  const id = new URL(request.url).searchParams.get("payment_id");
  if (!cartaoAtivo() || !id || !/^\d+$/.test(id)) {
    return NextResponse.json({ status: null });
  }
  try {
    return NextResponse.json(await sincronizarPagamento(id));
  } catch {
    return NextResponse.json({ status: null });
  }
}
