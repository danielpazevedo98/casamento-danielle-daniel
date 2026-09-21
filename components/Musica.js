"use client";
import { useEffect, useRef, useState } from "react";
import { EVENTO } from "@/lib/evento";

// Botao discreto de musica de fundo. Comeca sempre em silencio: navegador
// nenhum deixa tocar audio antes de a pessoa clicar. A escolha fica guardada
// no proprio aparelho, entao quem ligou uma vez volta com a musica tocando.
const CHAVE = "musica-casamento";

export default function Musica() {
  const audio = useRef(null);
  const [tocando, setTocando] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => setPronto(true), []);

  // Quem ja tinha ligado antes volta com a musica, mas so depois do primeiro
  // toque na tela, que e o que o navegador exige.
  useEffect(() => {
    if (!pronto || !EVENTO.musica) return;
    let guardado = null;
    try {
      guardado = localStorage.getItem(CHAVE);
    } catch {
      /* navegacao anonima: segue sem lembrar */
    }
    if (guardado !== "1") return;
    const ligar = () => {
      audio.current?.play().then(() => setTocando(true)).catch(() => {});
    };
    document.addEventListener("pointerdown", ligar, { once: true });
    return () => document.removeEventListener("pointerdown", ligar);
  }, [pronto]);

  if (!EVENTO.musica) return null;

  const alternar = async () => {
    const el = audio.current;
    if (!el) return;
    if (tocando) {
      el.pause();
      setTocando(false);
    } else {
      try {
        await el.play();
        setTocando(true);
      } catch {
        return; // o navegador recusou: nao muda nada na tela
      }
    }
    try {
      localStorage.setItem(CHAVE, tocando ? "0" : "1");
    } catch {
      /* sem problema: so nao lembra na proxima visita */
    }
  };

  return (
    <>
      <audio ref={audio} src={EVENTO.musica.arquivo} loop preload="none" />
      <button
        type="button"
        onClick={alternar}
        aria-label={tocando ? "Pausar a música" : "Tocar a música"}
        title={EVENTO.musica.titulo}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-carta/95 border border-dust text-wine shadow-[0_10px_30px_-12px_rgba(90,46,46,0.5)] backdrop-blur flex items-center justify-center transition-colors hover:text-fuchsia"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {tocando ? (
            <path d="M9 5v14M15 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <>
              <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <circle cx="7" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="17" cy="16" r="2.4" stroke="currentColor" strokeWidth="1.4" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
