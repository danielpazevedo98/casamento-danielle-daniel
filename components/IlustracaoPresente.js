import { CATEGORIAS } from "@/lib/evento";

// Tamanho do emoji conforme onde a ilustracao aparece.
const EMOJI = {
  mini: "text-xl", // miniatura da tabela do admin
  normal: "text-5xl sm:text-6xl md:text-7xl", // cartoes da lista
  grande: "text-8xl", // pagina do presente
};

// Imagem do presente: a enviada pelo admin ou, se nao tiver, o emoji do
// presente sobre um degrade da cor da categoria.
// coluna: no celular preenche a altura do cartao em linha; do tablet para cima, quadrado.
export default function IlustracaoPresente({ presente, tamanho = "normal", coluna = false }) {
  const forma = coluna
    ? "w-full h-full min-h-[7rem] sm:h-auto sm:min-h-0 sm:aspect-square"
    : tamanho === "grande"
      ? "w-full aspect-[16/10] lg:aspect-square" // pagina do presente: mais baixa no celular
      : "w-full aspect-square";
  // Na faixa larga da pagina do presente, o circulo acompanha a altura.
  const circulo = tamanho === "grande" ? "h-3/5" : "w-3/5";
  if (presente.imagem_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={presente.imagem_url}
        alt=""
        loading="lazy"
        className={`${forma} object-cover`}
      />
    );
  }
  const [c1, c2] = (CATEGORIAS.find((c) => c.nome === presente.categoria) || CATEGORIAS[0]).cores;
  return (
    <div
      className={`relative ${forma} overflow-hidden flex items-center justify-center`}
      style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
      aria-hidden="true"
    >
      <div className={`absolute ${circulo} aspect-square rounded-full bg-carta/35`} />
      <div className={`absolute ${circulo} aspect-square rounded-full border border-white/60 translate-x-2 translate-y-2`} />
      <span className={`relative drop-shadow-sm ${EMOJI[tamanho]}`}>
        {presente.emoji || "🎁"}
      </span>
    </div>
  );
}
