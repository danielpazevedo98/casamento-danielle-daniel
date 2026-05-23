export default function Sucesso() {
  return (
    <div className="min-h-screen bg-blush flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2"/>
          </svg>
        </div>
        <h2 className="font-serif text-4xl text-deep mb-4">Pagamento confirmado!</h2>
        <p className="font-serif text-lg text-wine mb-8">Recebemos seu carinho com muito amor.<br/>Nos vemos no dia 27.</p>
        <a href="/inicio" className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">VOLTAR AO SITE</a>
      </div>
    </div>
  );
}
