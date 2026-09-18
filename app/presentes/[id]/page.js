"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import IlustracaoPresente from "@/components/IlustracaoPresente";
import { reais } from "@/lib/formato";

const campo =
  "w-full py-3 px-4 bg-white border border-dust focus:outline-none focus:border-fuchsia font-serif text-lg text-deep";
const rotulo = "block mb-1 text-[0.7rem] tracking-[0.2em] text-wine font-sans";

function Copiar({ texto, children }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setOk(true);
          setTimeout(() => setOk(false), 2500);
        } catch {
          window.prompt("Copie o texto abaixo:", texto);
        }
      }}
      className="w-full py-3 border border-fuchsia text-fuchsia font-sans text-xs tracking-[0.25em] hover:bg-fuchsia hover:text-blush transition-colors"
    >
      {ok ? "COPIADO ✓" : children}
    </button>
  );
}

export default function PresenteDetalhes() {
  const { id } = useParams();
  const router = useRouter();
  const [dados, setDados] = useState(undefined);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(null);
  const [erro, setErro] = useState("");
  const [pix, setPix] = useState(null);

  useEffect(() => {
    fetch(`/api/presentes?id=${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setDados)
      .catch(() => setDados(null));
  }, [id]);

  const presentear = async (metodo) => {
    if (!nome.trim()) return setErro("Diga seu nome para os noivos saberem quem mandou o carinho.");
    setErro("");
    setEnviando(metodo);
    const r = await fetch("/api/presentear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ giftId: dados.presente.id, nome, email, mensagem, metodo }),
    });
    const resp = await r.json().catch(() => ({}));
    if (!r.ok) {
      setEnviando(null);
      if (resp.escolhido) return setDados({ ...dados, escolhido: true });
      return setErro(resp.error || "Algo deu errado. Tente de novo, por favor.");
    }
    if (metodo === "cartao") {
      window.location.href = resp.url;
      return;
    }
    setEnviando(null);
    setPix(resp);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jaPaguei = async () => {
    setEnviando("informar");
    await fetch("/api/presentear/informar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: pix.codigo }),
    }).catch(() => {});
    router.push("/pagamento/sucesso?metodo=pix");
  };

  if (dados === undefined) {
    return (
      <Layout>
        <div className="min-h-screen bg-blush flex items-center justify-center">
          <p className="font-serif text-xl text-wine italic">Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!dados) {
    return (
      <Layout>
        <div className="min-h-screen bg-blush flex items-center justify-center px-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-deep mb-6">Presente não encontrado</h2>
            <Link href="/presentes" className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em]">
              VER A LISTA
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { presente, cartao } = dados;

  // Cada presente so pode ser dado uma vez.
  if (dados.escolhido && !pix) {
    return (
      <Layout>
        <div className="min-h-screen bg-blush flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-6" aria-hidden="true">💝</div>
            <h2 className="font-serif text-3xl text-deep mb-3">Esse já foi escolhido!</h2>
            <p className="font-serif text-lg text-wine mb-8">
              Alguém chegou antes e escolheu <strong>{presente.nome}</strong>. Mas tem muitos outros esperando por você.
            </p>
            <Link href="/presentes" className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">
              VER OUTROS PRESENTES
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-blush px-6 pt-20 pb-16 md:py-16 flex justify-center">
        <div className="w-full max-w-4xl">
          <Link href="/presentes" className="inline-block mb-6 font-sans text-xs tracking-[0.2em] text-wine hover:text-deep">
            ← VOLTAR PARA A LISTA
          </Link>

          <div className="grid lg:grid-cols-[1fr_1.1fr] bg-white border border-dust shadow-lg">
            <div className="lg:border-r border-dust">
              <IlustracaoPresente presente={presente} grande />
              <div className="p-6 md:p-8">
                <p className="text-[0.65rem] tracking-[0.3em] text-fuchsia font-sans mb-2">
                  {(presente.categoria || "").toUpperCase()}
                </p>
                <h1 className="font-serif text-3xl text-deep leading-tight mb-3">{presente.nome}</h1>
                {presente.descricao && <p className="font-serif italic text-lg text-wine mb-4">{presente.descricao}</p>}
                <p className="font-sans text-2xl text-fuchsia font-medium">{reais(presente.preco)}</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {!pix ? (
                <>
                  <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium mb-6">QUEM ESTÁ PRESENTEANDO?</p>
                  <div className="space-y-4">
                    <div>
                      <label className={rotulo} htmlFor="nome">SEU NOME</label>
                      <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className={campo} autoComplete="name" />
                    </div>
                    <div>
                      <label className={rotulo} htmlFor="email">E-MAIL (OPCIONAL)</label>
                      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={campo} autoComplete="email" />
                    </div>
                    <div>
                      <label className={rotulo} htmlFor="msg">RECADO PARA OS NOIVOS (OPCIONAL)</label>
                      <textarea id="msg" rows={4} value={mensagem} onChange={(e) => setMensagem(e.target.value)} maxLength={1000} className={`${campo} resize-none`} placeholder="Escreva algo bonito (ou engraçado)..." />
                    </div>
                  </div>

                  {erro && <p className="mt-4 font-sans text-sm text-fuchsia">{erro}</p>}

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => presentear("pix")}
                      disabled={!!enviando}
                      className="w-full py-4 px-5 bg-wine text-blush font-sans text-sm tracking-[0.15em] hover:bg-fuchsia transition-colors flex items-center justify-between disabled:opacity-60"
                    >
                      <span>{enviando === "pix" ? "GERANDO PIX..." : "PAGAR COM PIX"}</span>
                      <span className="text-xs opacity-80">sem taxa</span>
                    </button>
                    {cartao && (
                      <button
                        onClick={() => presentear("cartao")}
                        disabled={!!enviando}
                        className="w-full py-4 px-5 border border-fuchsia text-fuchsia font-sans text-sm tracking-[0.15em] hover:bg-fuchsia hover:text-blush transition-colors flex items-center justify-between disabled:opacity-60"
                      >
                        <span>{enviando === "cartao" ? "ABRINDO..." : "CARTÃO DE CRÉDITO"}</span>
                        <span className="text-xs opacity-80">via Mercado Pago</span>
                      </button>
                    )}
                  </div>
                  <p className="mt-4 font-serif italic text-sm text-wine text-center leading-relaxed">
                    Pelo Pix o valor vai inteirinho para os noivos.
                    {cartao && " No cartão, o Mercado Pago cobra uma taxinha, mas a gente fica feliz do mesmo jeito!"}
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium mb-2">QUASE LÁ!</p>
                  <p className="font-serif text-lg text-wine mb-5">
                    Abra o app do seu banco e pague com o QR Code ou com o código copia e cola.
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pix.pix.qr} alt="QR Code do Pix" className="w-56 h-56 mx-auto border border-dust p-2" />
                  <p className="mt-4 font-sans text-2xl text-fuchsia font-medium">{reais(pix.valor)}</p>

                  <div className="mt-5 text-left">
                    <p className={rotulo}>PIX COPIA E COLA</p>
                    <p className="break-all font-mono text-xs text-deep bg-blush/60 border border-dust p-3 mb-3 max-h-24 overflow-y-auto">
                      {pix.pix.copiaECola}
                    </p>
                    <Copiar texto={pix.pix.copiaECola}>COPIAR CÓDIGO PIX</Copiar>
                  </div>

                  <p className="mt-5 font-serif italic text-sm text-wine">
                    Se preferir, use a chave <strong className="not-italic font-sans">{pix.pix.chave}</strong>
                    {pix.pix.banco && <> ({pix.pix.banco})</>} e digite o valor.
                  </p>

                  <p className="mt-5 font-sans text-xs text-wine/80">
                    O presente fica reservado para você por {pix.reservaMinutos === 60 ? "1 hora" : `${pix.reservaMinutos} minutos`}.
                    Depois de pagar, clique no botão abaixo para avisar os noivos.
                  </p>

                  <button
                    onClick={jaPaguei}
                    disabled={enviando === "informar"}
                    className="w-full mt-6 py-4 bg-wine text-blush font-sans text-xs tracking-[0.3em] hover:bg-fuchsia transition-colors disabled:opacity-60"
                  >
                    JÁ FIZ O PIX
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
