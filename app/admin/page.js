"use client";
import { useCallback, useEffect, useState } from "react";
import { AvisoProvider, api, cls, useAviso } from "./ui";
import AbaPainel from "./AbaPainel";
import AbaConvidados from "./AbaConvidados";
import AbaPresentes from "./AbaPresentes";
import AbaPagamentos from "./AbaPagamentos";

// A senha nunca fica neste arquivo: quem confere e o servidor, comparando com a
// variavel ADMIN_PASSWORD da Vercel. Depois disso a sessao fica num cookie.

function Login({ onEntrar, configurada }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setEntrando(true);
    setErro("");
    const r = await api("sessao", { method: "POST", corpo: { senha } });
    setEntrando(false);
    if (r.error) return setErro(r.error.message);
    setSenha("");
    onEntrar();
  };

  return (
    <div className="min-h-screen bg-blush flex items-center justify-center px-6">
      <form onSubmit={entrar} className="max-w-sm w-full bg-carta p-8 border border-dust shadow-lg text-center">
        <h1 className="font-serif text-3xl text-deep">Área restrita</h1>
        <p className="font-sans text-xs text-wine mt-1 mb-6">Casamento · Danielle &amp; Daniel</p>
        {!configurada && (
          <p className="font-sans text-xs text-fuchsia mb-4">
            A senha ainda não foi configurada na Vercel (variável ADMIN_PASSWORD).
          </p>
        )}
        <input
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          autoComplete="current-password"
          autoFocus
          className={`${cls.campo} mb-4`}
        />
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

function Painel({ onSair }) {
  const aviso = useAviso();
  const [aba, setAba] = useState("painel");
  const [dados, setDados] = useState(null);

  const recarregar = useCallback(async () => {
    const r = await api("dados");
    if (r.error) return aviso("Erro ao carregar: " + r.error.message);
    setDados(r.data);
  }, [aviso]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const sair = async () => {
    await api("sessao", { method: "DELETE" });
    onSair();
  };

  const props = { dados, recarregar };

  return (
    <div className="min-h-screen bg-blush">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <header className="flex flex-wrap items-center justify-between gap-3 py-5">
          <h1 className="font-serif text-3xl text-deep">Administração</h1>
          <div className="flex items-center gap-2">
            <button className={cls.btnSec} onClick={recarregar}>Atualizar</button>
            <button className={cls.btnSec} onClick={sair}>Sair</button>
          </div>
        </header>

        <nav className="flex flex-wrap gap-2 mb-6">
          {ABAS.map(([id, rotulo]) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`px-4 py-2.5 font-sans text-xs tracking-[0.15em] border transition-colors ${
                aba === id ? "bg-wine text-blush border-wine" : "bg-carta text-wine border-dust hover:border-wine"
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
  const [sessao, setSessao] = useState(null);

  const verificar = useCallback(async () => {
    const r = await api("sessao");
    setSessao(r.data || { logado: false, configurada: true });
  }, []);

  useEffect(() => {
    verificar();
    // Alguma rota respondeu 401 (sessao venceu): volta para o login.
    const saiu = () => setSessao((s) => ({ ...s, logado: false }));
    window.addEventListener("admin-saiu", saiu);
    return () => window.removeEventListener("admin-saiu", saiu);
  }, [verificar]);

  if (!sessao) return <div className="min-h-screen bg-blush" />;
  if (!sessao.logado) return <Login configurada={sessao.configurada} onEntrar={verificar} />;
  return <Painel onSair={verificar} />;
}

export default function Admin() {
  return (
    <AvisoProvider>
      <Portaria />
    </AvisoProvider>
  );
}
