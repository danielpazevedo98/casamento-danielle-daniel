"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TelaRecado from "@/components/TelaRecado";

function Conteudo() {
  const params = useSearchParams();
  const metodo = params.get("metodo");
  const pagamento = params.get("payment_id") || params.get("collection_id");

  // Volta do Mercado Pago: confirma o presente na hora, sem esperar o webhook.
  useEffect(() => {
    if (metodo === "cartao" && pagamento) {
      fetch(`/api/pagamento/verificar?payment_id=${encodeURIComponent(pagamento)}`).catch(() => {});
    }
  }, [metodo, pagamento]);

  if (metodo === "pix") {
    return (
      <TelaRecado icone="💝" titulo="Muito obrigado!">
        <p>Assim que o Pix cair na nossa conta, a gente confere tudo por aqui.</p>
        <p className="italic">Seu carinho já chegou no nosso coração. Nos vemos no dia 27!</p>
      </TelaRecado>
    );
  }
  return (
    <TelaRecado icone="💝" titulo="Pagamento aprovado!">
      <p>Recebemos seu carinho com muito amor.</p>
      <p className="italic">Nos vemos no dia 27!</p>
    </TelaRecado>
  );
}

export default function Sucesso() {
  return (
    <Suspense fallback={null}>
      <Conteudo />
    </Suspense>
  );
}
