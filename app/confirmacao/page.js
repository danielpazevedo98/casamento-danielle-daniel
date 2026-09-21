"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { Cabecalho } from "@/components/Enfeites";
import PortaoVasco from "@/components/PortaoVasco";
import { EVENTO } from "@/lib/evento";

// A mensagem final reflete o que foi marcado: "presenças confirmadas" soava
// errado para quem respondeu que não vai. (Mesma regra do chá de panela.)
function mensagemRsvp(respostas) {
  const vao = respostas.filter((r) => r.presenca === "vai").length;
  const nao = respostas.length - vao;
  const plural = (n, um, muitos) => n + " " + (n === 1 ? um : muitos);
  if (vao && nao) {
    return `${plural(vao, "presença confirmada", "presenças confirmadas")} e ${plural(nao, "ausência registrada", "ausências registradas")}. Obrigado por avisar!`;
  }
  if (vao) {
    return (vao === 1 ? "Presença confirmada." : plural(vao, "presença confirmada", "presenças confirmadas") + ".") + " Mal podemos esperar para dançar com vocês!";
  }
  return nao === 1
    ? "Resposta registrada. Vamos sentir sua falta!"
    : plural(nao, "ausência registrada", "ausências registradas") + ". Vamos sentir falta de vocês!";
}

const campo =
  "w-full py-3 px-5 bg-carta border border-dust focus:outline-none focus:border-fuchsia font-serif text-lg text-deep";

export default function Confirmacao() {
  const [busca, setBusca] = useState("");
  const [sugestoes, setSugestoes] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [membros, setMembros] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [quem, setQuem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [final, setFinal] = useState(null);
  const caixa = useRef(null);

  // Busca com um pequeno atraso para nao consultar a cada tecla.
  useEffect(() => {
    if (selecionado) return;
    const q = busca.trim();
    if (q.length < 2) {
      setSugestoes(null);
      return;
    }
    const t = setTimeout(async () => {
      const r = await fetch(`/api/rsvp/buscar?q=${encodeURIComponent(q)}`);
      setSugestoes(r.ok ? await r.json() : []);
    }, 250);
    return () => clearTimeout(t);
  }, [busca, selecionado]);

  useEffect(() => {
    const fora = (e) => caixa.current && !caixa.current.contains(e.target) && setSugestoes(null);
    document.addEventListener("click", fora);
    return () => document.removeEventListener("click", fora);
  }, []);

  const escolher = async (pessoa) => {
    setSelecionado(pessoa);
    setSugestoes(null);
    setBusca(pessoa.nome);
    setErro("");
    const r = await fetch(`/api/rsvp/grupo?convidado=${pessoa.id}`);
    if (!r.ok) {
      setErro("Esse convite já foi respondido. Se precisar mudar algo, fale com os noivos.");
      setSelecionado(null);
      return;
    }
    setMembros(await r.json());
    setRespostas({});
    setQuem(pessoa.nome);
  };

  const recomecar = () => {
    setSelecionado(null);
    setMembros(null);
    setBusca("");
    setRespostas({});
    setErro("");
    setFinal(null);
  };

  const enviar = async () => {
    const lista = Object.entries(respostas).map(([id, presenca]) => ({ id: Number(id), presenca }));
    if (!lista.length) return setErro("Marque Vai ou Não vai para pelo menos uma pessoa.");
    if (!quem.trim()) return setErro("Diga quem está preenchendo a confirmação.");
    setEnviando(true);
    setErro("");
    const r = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ respostas: lista, confirmadoPor: quem.trim() }),
    });
    setEnviando(false);
    if (!r.ok) {
      const { error } = await r.json().catch(() => ({}));
      return setErro(error || "Não consegui salvar. Tente de novo, por favor.");
    }
    setFinal({
      texto: mensagemRsvp(lista),
      vao: membros.filter((m) => respostas[m.id] === "vai").map((m) => m.nome),
    });
  };

  if (final) {
    return (
      <Layout>
        <div className="min-h-screen bg-blush flex items-center justify-center px-6 py-16">
          <div className="text-center max-w-md">
            <h2 className="font-serif text-5xl text-deep italic font-light mb-4">
              {final.vao.length ? "Que alegria!" : "Obrigado por avisar"}
            </h2>
            <p className="font-serif text-xl text-wine mb-6">{final.texto}</p>
            {final.vao.length > 0 && (
              <ul className="space-y-1 mb-8">
                {final.vao.map((n) => (
                  <li key={n} className="font-serif text-xl text-deep italic">{n}</li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/presentes" className="px-7 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">
                VER LISTA DE PRESENTES
              </Link>
              <button onClick={recomecar} className="px-7 py-3 border border-fuchsia text-fuchsia font-sans text-xs tracking-[0.25em] hover:bg-fuchsia hover:text-blush transition-colors">
                CONFIRMAR OUTRA PESSOA
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-blush px-6 md:px-16 pt-20 pb-16 md:py-16">
        <div className="max-w-xl mx-auto">
          <Cabecalho sobre="R.S.V.P." titulo="Confirmar Presença">
            Digite seu nome para encontrar você e quem vai com você.
            {EVENTO.prazoRsvp && (
              <span className="block not-italic font-sans text-xs tracking-[0.2em] text-fuchsia mt-4">
                CONFIRME ATÉ {EVENTO.prazoRsvp.texto.toUpperCase()}
              </span>
            )}
          </Cabecalho>

          <PortaoVasco>
          <div className="relative" ref={caixa}>
            <input
              type="text"
              value={busca}
              autoComplete="off"
              disabled={!!selecionado}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Comece a digitar seu nome..."
              className={`${campo} disabled:bg-petal/40`}
            />
            {sugestoes && (
              <div className="absolute top-full left-0 right-0 bg-carta border border-dust border-t-0 shadow-lg z-10">
                {sugestoes.length ? (
                  sugestoes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => escolher(s)}
                      className="w-full text-left px-5 py-3 hover:bg-petal/60 border-b border-dust/50 last:border-b-0"
                    >
                      <span className="font-serif text-lg text-deep">{s.nome}</span>
                      {s.com.length > 0 && (
                        <span className="font-sans text-xs text-wine/70"> · com {s.com.join(", ")}</span>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="px-5 py-4 font-serif italic text-wine">
                    Não encontramos ninguém com esse nome. Se você já confirmou, não precisa confirmar de novo 😊
                  </p>
                )}
              </div>
            )}
          </div>

          {membros && (
            <div className="mt-8 bg-carta border border-dust p-6 md:p-8">
              <p className="text-xs tracking-[0.3em] text-fuchsia font-sans font-medium text-center">QUEM VAI COMPARECER?</p>
              <p className="font-serif italic text-wine text-center mt-2 mb-6">
                Você não precisa responder por todo mundo: marque só quem você puder confirmar agora.
              </p>

              <div className="space-y-2">
                {membros.map((m) => (
                  <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 border border-dust px-4 py-3">
                    <span className="font-serif text-lg text-deep">{m.nome}</span>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {[
                        ["vai", "Vai", "bg-wine text-blush border-wine"],
                        ["nao_vai", "Não vai", "bg-wine/60 text-blush border-wine/60"],
                      ].map(([valor, rotulo, on]) => (
                        <button
                          key={valor}
                          onClick={() => setRespostas((r) => ({ ...r, [m.id]: valor }))}
                          aria-pressed={respostas[m.id] === valor}
                          className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-2 border font-sans text-xs tracking-[0.15em] transition-colors ${
                            respostas[m.id] === valor ? on : "border-dust text-wine/70 hover:border-wine"
                          }`}
                        >
                          {rotulo}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <label className="block mt-6 mb-2 text-xs tracking-[0.2em] text-wine font-sans" htmlFor="quem">
                QUEM ESTÁ PREENCHENDO ESTA CONFIRMAÇÃO?
              </label>
              <input id="quem" type="text" value={quem} onChange={(e) => setQuem(e.target.value)} className={campo} />

              {erro && <p className="mt-4 font-sans text-sm text-fuchsia">{erro}</p>}

              <button
                onClick={enviar}
                disabled={enviando}
                className="w-full mt-6 py-4 bg-wine text-blush font-sans text-xs tracking-[0.3em] hover:bg-fuchsia transition-colors disabled:opacity-60"
              >
                {enviando ? "ENVIANDO..." : "CONFIRMAR"}
              </button>
              <button onClick={recomecar} className="w-full mt-3 py-2 font-sans text-[0.7rem] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] text-wine hover:text-deep">
                ← NÃO SOU EU, BUSCAR OUTRO NOME
              </button>
            </div>
          )}
          {!membros && erro && <p className="mt-4 font-sans text-sm text-fuchsia text-center">{erro}</p>}
          </PortaoVasco>
        </div>
      </div>
    </Layout>
  );
}
