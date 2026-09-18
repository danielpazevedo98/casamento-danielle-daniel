import { NextResponse } from "next/server";
import { COOKIE, novaSessao, opcoesCookie, senhaConfere, senhaConfigurada, sessaoValida } from "@/lib/adminAuth";
import { lerCorpo } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

// Esta logado?
export async function GET(request) {
  return NextResponse.json({ logado: sessaoValida(request), configurada: senhaConfigurada() });
}

// Entrar com a senha ADMIN_PASSWORD.
export async function POST(request) {
  if (!senhaConfigurada()) {
    return NextResponse.json(
      { error: "A senha do admin não está configurada na Vercel (variável ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }
  const { senha } = await lerCorpo(request);
  if (!senhaConfere(senha)) {
    // Uma pequena espera deixa tentativas de adivinhar a senha bem mais lentas.
    await new Promise((ok) => setTimeout(ok, 800));
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE, novaSessao(), opcoesCookie());
  return resposta;
}

// Sair.
export async function DELETE() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE, "", opcoesCookie(0));
  return resposta;
}
