"use client";
import { useCallback, useEffect, useState } from "react";
import { supabaseNavegador } from "@/lib/supabase";
import { AvisoProvider, cls, useAviso } from "./ui";
import AbaPainel from "./AbaPainel";
import AbaConvidados from "./AbaConvidados";
import AbaPresentes from "./AbaPresentes";
import AbaPagamentos from "./AbaPagamentos";

// A senha nunca fica no codigo: quem confere e o Supabase Auth. Depois do
// login, o banco so libera os dados se o e-mail estiver na tabela admins.

function Login() {
  const db = supabaseNavegador();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setEntrando(true);
    setErro("");
    const { error } = await db.auth.signInWithPassword({ email: email.trim(), password: senha });
    setEntrando(false);
    if (error) setErro(/invalid/i.test(error.message) ? "E-mail ou senha incorretos." : error.message);
  };

  return (
    <div className="min-h-screen bg-blush flex items-center justify-center px-6">
      <form onSubmit={entrar} className="max-w-sm w-full bg-white p-8 border border-dust shadow-lg text-center">
        <h1 className="font-serif text-3xl text-deep">Área restrita</h1>
        <p className="font-sans text-xs text-wine mt-1 mb-6">Casamento · Danielle &amp; Daniel</p>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" autoComplete="username" className={`${cls.campo} mb-3`} />
        <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" autoComplete="current-password" className={`${cls.campo} mb-4`} />
        <button type="submit" disabled={entrando} className={`${cls.btn} w-full py-3`}>
          {entrando ? "Entrando..." : "Entrar"}
        </button>
        <p className="font-sans text-xs text-fuchsia mt-3 min-h-[1rem]">{erro}</p>
      </form>
    </div>
  );
}

const ABAS = [
  ["painel", "Painel"],
  ["convidados", "Convidados"],
  ["presentes", "Presentes"],
  ["pagamentos", "Pagamentos"],
];

function Painel({ email }) {
  const db = supabaseNavegador();
  const aviso = useAviso();
  const [aba, setAba] = useState("painel");
  const [dados, setDados] = useState(null);

  const recarregar = useCallback(async () => {
    const [c, g, p, cl] = await Promise.all([
      db.from("guests").select("*").order("nome"),
      db.from("guest_groups").select("*").order("id"),
      db.from("gifts").select("*").order("preco").order("nome"),
      db.from("gift_claims").select("*").order("criado_em", { ascending: false }),
    ]);
    const erro = c.error || g.error || p.error || cl.error;
    if (erro) return aviso("Erro ao carregar: " + erro.message);
    setDados({ convidados: c.data, grupos: g.data, presentes: p.data, claims: cl.data });
  }, [db, aviso]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const props = { dados, recarregar };

  return (
    <div className="min-h-screen bg-blush">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <header className="flex flex-wrap items-center justify-between gap-3 py-5">
          <h1 className="font-serif text-3xl text-deep">Administração</h1>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-wine">{email}</span>
            <button className={cls.btnSec} onClick={() => db.auth.signOut()}>Sair</button>
          </div>
        </header>

        <nav className="flex flex-wrap gap-2 mb-6">
          {ABAS.map(([id, rotulo]) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`px-4 py-2.5 font-sans text-xs tracking-[0.15em] border transition-colors ${
                aba === id ? "bg-wine text-blush border-wine" : "bg-white text-wine border-dust hover:border-wine"
              }`}
            >
              {rotulo.toUpperCase()}
            </button>
          ))}
        </nav>

        {!dados ? (
          <p className="font-serif italic text-wine text-lg">Carregando...</p>
        ) : aba === "painel" ? (
          <AbaPainel {...props} irPara={setAba} />
        ) : aba === "convidados" ? (
          <AbaConvidados {...props} />
        ) : aba === "presentes" ? (
          <AbaPresentes {...props} />
        ) : (
          <AbaPagamentos {...props} />
        )}
      </div>
    </div>
  );
}

function Portaria() {
  const db = supabaseNavegador();
  const [sessao, setSessao] = useState(undefined);
  const [autorizado, setAutorizado] = useState(null);
  const usuario = sessao?.user?.id;

  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSessao(data.session));
    const { data } = db.auth.onAuthStateChange((_evento, s) => setSessao(s));
    return () => data.subscription.unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!usuario) return setAutorizado(null);
    db.from("admins").select("email").then(({ data }) => setAutorizado(Boolean(data?.length)));
  }, [db, usuario]);

  if (sessao === undefined || (sessao && autorizado === null)) {
    return <div className="min-h-screen bg-blush" />;
  }
  if (!sessao) return <Login />;
  if (!autorizado) {
    return (
      <div className="min-h-screen bg-blush flex items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white p-8 border border-dust text-center">
          <p className="font-serif text-xl text-deep mb-2">Sem acesso</p>
          <p className="font-sans text-sm text-wine mb-6">O e-mail {sessao.user.email} não está liberado para o admin.</p>
          <button className={cls.btnSec} onClick={() => db.auth.signOut()}>Sair</button>
        </div>
      </div>
    );
  }
  return <Painel email={sessao.user.email} />;
}

export default function Admin() {
  return (
    <AvisoProvider>
      <Portaria />
    </AvisoProvider>
  );
}
