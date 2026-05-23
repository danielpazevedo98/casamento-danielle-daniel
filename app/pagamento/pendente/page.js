export default function Pendente() {
  return (
    <div className="min-h-screen bg-blush flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h2 className="font-serif text-4xl text-deep mb-4">Pagamento pendente</h2>
        <p className="font-serif text-lg text-wine mb-8">Seu pagamento está sendo processado.<br/>Você receberá um email assim que for confirmado.</p>
        <a href="/inicio" className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">VOLTAR AO SITE</a>
      </div>
    </div>
  );
}
