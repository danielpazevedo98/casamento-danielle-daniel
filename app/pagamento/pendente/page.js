import TelaRecado from "@/components/TelaRecado";

export default function Pendente() {
  return (
    <TelaRecado icone="⏳" titulo="Pagamento em análise">
      <p>O Mercado Pago ainda está processando seu pagamento.</p>
      <p className="italic">Quando for aprovado, ele aparece para os noivos automaticamente. Obrigado pelo carinho!</p>
    </TelaRecado>
  );
}
