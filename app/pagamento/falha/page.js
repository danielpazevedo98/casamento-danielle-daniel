export default function Falha() {
  return (
    <div className="min-h-screen bg-blush flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h2 className="font-serif text-4xl text-deep mb-4">Ops, algo deu errado</h2>
        <p className="font-serif text-lg text-wine mb-8">O pagamento não foi processado.<br/>Tente novamente ou escolha outra forma.</p>
        <a href="/presentes" className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">VOLTAR AOS PRESENTES</a>
      </div>
    </div>
  );
}
