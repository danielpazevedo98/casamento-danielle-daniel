import { NextResponse } from "next/server";

// Pequenos ajudantes das rotas /api/admin.

// So deixa passar os campos permitidos de cada tabela.
export const escolher = (obj, campos) =>
  Object.fromEntries(campos.filter((k) => obj && k in obj).map((k) => [k, obj[k]]));

export const ok = (dados = { ok: true }) => NextResponse.json(dados);

// Traduz erros do banco em mensagens para o admin. mensagens = { codigo: texto }.
export function falha(error, mensagens = {}) {
  return NextResponse.json(
    { error: mensagens[error.code] || error.message, code: error.code },
    { status: error.code ? 400 : 500 }
  );
}

export const lerCorpo = (request) => request.json().catch(() => ({}));

// Pedido com dados errados (erro de quem chamou, nao do servidor).
export const invalido = (texto) => NextResponse.json({ error: texto }, { status: 400 });
