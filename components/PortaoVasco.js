"use client";
import { useEffect, useState } from "react";
import { Divisor } from "@/components/Enfeites";

// Brincadeira antes do RSVP: so passa quem responde que o maior time do mundo
// e o Vasco. Quem erra ganha uma segunda chance com uma opcao so, entao ninguem
// fica preso aqui. A resposta vale enquanto a aba estiver aberta, para nao
// repetir a piada a cada recarga.
const CHAVE = "portao-vasco";

const CERTA = "Vasco da Gama";

export default function PortaoVasco({ children }) {
  const [etapa, setEtapa] = useState("carregando");

  useEffect(() => {
    let passou = null;
    try {
      passou = sessionStorage.getItem(CHAVE);
    } catch {
      /* navegacao anonima: a piada aparece de novo, sem problema */
    }
    setEtapa(passou === "1" ? "liberado" : "pergunta");
  }, []);

  const liberar = () => {
    try {
      sessionStorage.setItem(CHAVE, "1");
    } catch {
      /* segue sem lembrar */
    }
    setEtapa("liberado");
  };

  if (etapa === "carregando") return null;
  if (etapa === "liberado") return children;

  return (
    <div className="bg-carta border border-dust p-8 md:p-10 text-center">
      {etapa === "pergunta" && (
        <>
          <p className="text-xs tracking-[0.3em] text-fuchsia font-sans font-medium">ANTES DE CONFIRMAR</p>
          <p className="font-serif text-3xl md:text-4xl text-deep mt-3">Qual o maior time do Mundo?</p>
          <Divisor />
          <p className="font-serif italic text-lg text-wine mt-3">
            Uma perguntinha rápida. Prometemos que é fácil.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button onClick={() => setEtapa("acertou")} className={botao}>
              {CERTA}
            </button>
            <button onClick={() => setEtapa("errou")} className={botaoVazio}>
              Qualquer outro menor
            </button>
          </div>
        </>
      )}

      {etapa === "errou" && (
        <>
          <p className="text-xs tracking-[0.3em] text-fuchsia font-sans font-medium">ERROU</p>
          <p className="font-serif text-3xl md:text-4xl text-deep mt-3">Não foi dessa vez.</p>
          <Divisor />
          <p className="font-serif italic text-lg text-wine mt-3 text-balance">
            A gente releu a pergunta procurando outra interpretação e não achou nenhuma. Respira fundo, pensa com
            carinho e tenta mais uma vez.
          </p>
          <button onClick={() => setEtapa("segunda")} className={`${botao} mt-8 w-full`}>
            TENTAR DE NOVO
          </button>
        </>
      )}

      {etapa === "segunda" && (
        <>
          <p className="text-xs tracking-[0.3em] text-fuchsia font-sans font-medium">SEGUNDA CHANCE</p>
          <p className="font-serif text-3xl md:text-4xl text-deep mt-3">Qual o maior time do Mundo?</p>
          <Divisor />
          <p className="font-serif italic text-lg text-wine mt-3 text-balance">
            Para facilitar, reduzimos as opções.
          </p>
          <button onClick={() => setEtapa("acertouDepois")} className={`${botao} mt-8 w-full`}>
            {CERTA} — o maior de todos
          </button>
        </>
      )}

      {(etapa === "acertou" || etapa === "acertouDepois") && (
        <>
          <p className="text-xs tracking-[0.3em] text-fuchsia font-sans font-medium">RESPOSTA CERTA</p>
          <p className="font-serif text-3xl md:text-4xl text-deep mt-3">
            {etapa === "acertou" ? "Sabíamos que dava para confiar!" : "Agora sim!"}
          </p>
          <Divisor />
          <p className="font-serif italic text-lg text-wine mt-3 text-balance">
            {etapa === "acertou"
              ? "De primeira e sem hesitar. Pode passar: a confirmação está liberada."
              : "Demorou, mas você chegou lá. O importante é terminar do lado certo da história."}
          </p>
          <button onClick={liberar} className={`${botao} mt-8 w-full`}>
            CONFIRMAR PRESENÇA
          </button>
        </>
      )}
    </div>
  );
}

const botao =
  "px-7 py-4 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors";
const botaoVazio =
  "px-7 py-4 border border-fuchsia text-fuchsia font-sans text-xs tracking-[0.25em] hover:bg-fuchsia hover:text-blush transition-colors";
