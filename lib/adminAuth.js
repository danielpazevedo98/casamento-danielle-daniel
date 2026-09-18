import crypto from "crypto";
import { NextResponse } from "next/server";

// Login do /admin: uma senha so, a variavel ADMIN_PASSWORD da Vercel. Depois de
// conferida, o navegador recebe um cookie assinado (httpOnly: o JavaScript da
// pagina nao consegue ler). Trocar a senha na Vercel derruba as sessoes abertas.

export const COOKIE = "admin_casamento";
const DIAS = 14;

const hash = (texto) => crypto.createHash("sha256").update(texto).digest();
const chave = () => hash(`${process.env.SUPABASE_SERVICE_ROLE_KEY}|${process.env.ADMIN_PASSWORD}`);
const assinar = (texto) => crypto.createHmac("sha256", chave()).update(texto).digest("hex");

export const senhaConfigurada = () => Boolean(process.env.ADMIN_PASSWORD);

export function senhaConfere(senha) {
  if (!senhaConfigurada() || typeof senha !== "string") return false;
  return crypto.timingSafeEqual(hash(senha), hash(process.env.ADMIN_PASSWORD));
}

export function novaSessao() {
  const expira = String(Date.now() + DIAS * 86400000);
  return `${expira}.${assinar(expira)}`;
}

export const opcoesCookie = (maxAge = DIAS * 86400) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge,
});

export function sessaoValida(request) {
  const valor = request.cookies.get(COOKIE)?.value;
  if (!valor || !senhaConfigurada()) return false;
  const [expira, assinatura] = valor.split(".");
  if (!expira || !assinatura || Number(expira) < Date.now()) return false;
  const esperado = assinar(expira);
  return esperado.length === assinatura.length && crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(assinatura));
}

// Uso nas rotas: const negado = exigirAdmin(request); if (negado) return negado;
export function exigirAdmin(request) {
  return sessaoValida(request) ? null : NextResponse.json({ error: "Sua sessão acabou. Entre de novo." }, { status: 401 });
}
