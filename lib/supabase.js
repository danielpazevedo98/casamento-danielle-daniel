import { createClient } from "@supabase/supabase-js";

// Servidor: ignora o RLS. So pode ser usado dentro de app/api.
// O Next 14 guarda em cache as respostas de fetch feitas no servidor; sem o
// "no-store", a busca da confirmacao continuava mostrando quem ja respondeu.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false },
      global: { fetch: (url, opcoes) => fetch(url, { ...opcoes, cache: "no-store" }) },
    }
  );
}

// Navegador (so o /admin): chave publica + sessao do login. O RLS so libera
// os dados para e-mails cadastrados na tabela admins.
let navegador;
export function supabaseNavegador() {
  if (!navegador) {
    navegador = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return navegador;
}
