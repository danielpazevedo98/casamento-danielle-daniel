import { createClient } from "@supabase/supabase-js";

// Unico acesso ao banco: so no servidor (app/api), com a chave service_role.
// Visitantes e o navegador nunca falam direto com o Supabase.
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
