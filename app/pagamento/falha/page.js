import TelaRecado from "@/components/TelaRecado";

export default function Falha() {
  return (
    <TelaRecado icone="🙈" titulo="Ops, não deu certo" link="/presentes" textoLink="VOLTAR AOS PRESENTES">
      <p>O pagamento não foi concluído e nada foi cobrado.</p>
      <p className="italic">Tente de novo ou escolha pagar com Pix.</p>
    </TelaRecado>
  );
}
