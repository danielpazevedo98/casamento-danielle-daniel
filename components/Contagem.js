"use client";
import { useEffect, useState } from "react";
import { EVENTO } from "@/lib/evento";

// Barra "Faltam" com dias, horas, minutos e segundos ate a cerimonia.
export default function Contagem() {
  const [t, setT] = useState(null);

  useEffect(() => {
    const alvo = new Date(EVENTO.inicio).getTime();
    const tick = () => {
      const d = Math.max(0, alvo - Date.now());
      setT({
        d: Math.floor(d / 86400000),
        h: Math.floor((d / 3600000) % 24),
        m: Math.floor((d / 60000) % 60),
        s: Math.floor((d / 1000) % 60),
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const Celula = ({ n, l }) => (
    <div className="text-center min-w-[3.5rem]">
      <p className="font-serif font-light text-blush leading-none text-[clamp(1.6rem,4vw,2.5rem)] tabular-nums">
        {t ? String(n).padStart(2, "0") : "··"}
      </p>
      <p className="text-[0.65rem] mt-1 text-petal/85 font-sans tracking-[0.3em]">{l}</p>
    </div>
  );

  return (
    <div className="py-8 px-6 bg-[linear-gradient(90deg,#5a2e2e_0%,#8a2e4a_50%,#5a2e2e_100%)]">
      <p className="text-center text-xs mb-6 tracking-[0.4em] text-petal font-sans">✦ FALTAM ✦</p>
      <div className="flex justify-center gap-5 md:gap-16">
        <Celula n={t?.d} l="DIAS" />
        <Celula n={t?.h} l="HORAS" />
        <Celula n={t?.m} l="MIN" />
        <Celula n={t?.s} l="SEG" />
      </div>
    </div>
  );
}
