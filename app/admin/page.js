export default function Admin() {
  return (
    <div className="min-h-screen bg-blush flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 border border-dust shadow-lg">
        <h1 className="font-serif text-3xl text-deep text-center mb-8">Painel Admin</h1>
        <p className="font-serif italic text-wine text-center">Em desenvolvimento.<br/>Acesse o Supabase diretamente para gerenciar dados.</p>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="mt-6 block w-full py-3 text-center bg-wine text-blush font-sans text-xs tracking-[0.3em] hover:bg-fuchsia transition-colors">IR PARA SUPABASE</a>
      </div>
    </div>
  );
}
