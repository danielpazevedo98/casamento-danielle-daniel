import { CATEGORIAS } from "@/lib/evento";

// Imagem do presente: a enviada pelo admin ou, se nao tiver, o emoji do
// presente sobre um degrade da cor da categoria.
export default function IlustracaoPresente({ presente, grande = false }) {
  if (presente.imagem_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={presente.imagem_url}
        alt=""
        loading="lazy"
        className="w-full aspect-square object-cover"
      />
    );
  }
  const [c1, c2] = (CATEGORIAS.find((c) => c.nome === presente.categoria) || CATEGORIAS[0]).cores;
  return (
    <div
      className="relative w-full aspect-square overflow-hidden flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
      aria-hidden="true"
    >
      <div className="absolute w-3/5 aspect-square rounded-full bg-white/35" />
      <div className="absolute w-3/5 aspect-square rounded-full border border-white/60 translate-x-2 translate-y-2" />
      <span className={`relative drop-shadow-sm ${grande ? "text-8xl" : "text-6xl md:text-7xl"}`}>
        {presente.emoji || "🎁"}
      </span>
    </div>
  );
}
