"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

// Fotos do casal passando uma ao lado da outra no mesmo espaco: troca sozinha
// a cada 3 segundos e tambem quando a pessoa toca na foto. Quem prefere menos
// animacao (ajuste do proprio celular) fica com a foto parada.
export default function CarrosselFotos({ fotos, alt, segundos = 3, sizes }) {
  const [atual, setAtual] = useState(0);
  const [animar, setAnimar] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setAnimar(!media.matches);
    ler();
    media.addEventListener("change", ler);
    return () => media.removeEventListener("change", ler);
  }, []);

  const avancar = useCallback(() => setAtual((n) => (n + 1) % fotos.length), [fotos.length]);

  // Depende de "atual": tocar na foto reinicia a contagem dos 3 segundos.
  useEffect(() => {
    if (!animar) return;
    const t = setTimeout(avancar, segundos * 1000);
    return () => clearTimeout(t);
  }, [atual, animar, avancar, segundos]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        onClick={avancar}
        className="flex h-full transition-transform duration-700 ease-out cursor-pointer"
        style={{ transform: `translateX(-${atual * 100}%)`, transitionDuration: animar ? undefined : "0ms" }}
      >
        {fotos.map((foto, n) => (
          <div key={foto} className="relative w-full h-full shrink-0">
            <Image src={foto} alt={`${alt} (${n + 1} de ${fotos.length})`} fill priority={n === 0} sizes={sizes} className="object-cover" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
        {fotos.map((foto, n) => (
          <button
            key={foto}
            onClick={() => setAtual(n)}
            aria-label={`Ver foto ${n + 1}`}
            aria-current={n === atual}
            className={`h-2 rounded-full transition-all ${
              n === atual ? "w-6 bg-carta" : "w-2 bg-carta/60 hover:bg-carta"
            } shadow`}
          />
        ))}
      </div>
    </div>
  );
}
