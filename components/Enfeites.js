import Image from "next/image";
import CarrosselFotos from "@/components/CarrosselFotos";

// Elementos visuais do PROTOTIPO-VISUAL.jsx, reaproveitados nas paginas.

export const Flores = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 200 200" className={`pointer-events-none ${className}`} style={style} fill="none" aria-hidden="true">
    <g opacity="0.55">
      <circle cx="40" cy="40" r="16" fill="#e4c3c1" opacity="0.6" />
      <circle cx="40" cy="40" r="10" fill="#be185d" opacity="0.35" />
      <circle cx="40" cy="40" r="5" fill="#ec4899" opacity="0.5" />
      <circle cx="40" cy="40" r="2" fill="#be185d" opacity="0.8" />
      <ellipse cx="70" cy="35" rx="18" ry="6" fill="#e4c3c1" opacity="0.45" transform="rotate(-25 70 35)" />
      <ellipse cx="60" cy="65" rx="15" ry="5" fill="#c89968" opacity="0.35" transform="rotate(40 60 65)" />
      <ellipse cx="30" cy="70" rx="12" ry="4" fill="#ec4899" opacity="0.25" transform="rotate(-70 30 70)" />
      <circle cx="80" cy="60" r="4" fill="#be185d" opacity="0.5" />
      <circle cx="25" cy="90" r="3" fill="#ec4899" opacity="0.5" />
      <path d="M 40 50 Q 50 80, 30 110" stroke="#8a4a48" strokeWidth="0.7" opacity="0.4" />
      <path d="M 50 60 Q 70 90, 60 130" stroke="#8a4a48" strokeWidth="0.7" opacity="0.4" />
    </g>
  </svg>
);

export const Divisor = () => (
  <div className="flex items-center justify-center gap-3 my-3" aria-hidden="true">
    <div className="h-px w-[70px] opacity-70 bg-gradient-to-r from-transparent to-gold" />
    <svg width="12" height="12" viewBox="0 0 10 10">
      <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#be185d" opacity="0.85" />
    </svg>
    <div className="h-px w-[70px] opacity-70 bg-gradient-to-r from-gold to-transparent" />
  </div>
);

// Titulo padrao das secoes: sobrelinha em fucsia, titulo grande e texto opcional.
export function Cabecalho({ sobre, titulo, children }) {
  return (
    <div className="text-center mb-10 md:mb-12">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-px w-6 bg-fuchsia" />
        <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium">{sobre}</p>
        <div className="h-px w-6 bg-fuchsia" />
      </div>
      <h2 className="font-serif text-4xl md:text-5xl text-deep font-light">{titulo}</h2>
      <Divisor />
      {children && <div className="mt-4 font-serif italic text-lg text-wine max-w-xl mx-auto">{children}</div>}
    </div>
  );
}

const DESENHOS = {
  noivos: (
    <g>
      <circle cx="80" cy="70" r="22" fill="#e89aa0" opacity="0.6" />
      <circle cx="120" cy="70" r="22" fill="#8a4a48" opacity="0.45" />
      <path d="M50 130 Q 80 100 100 115 Q 120 100 150 130 L 150 160 L 50 160 Z" fill="#8a4a48" opacity="0.35" />
    </g>
  ),
  igreja: (
    <g>
      <path d="M100 30 L100 60 M90 45 L110 45" stroke="#8a4a48" strokeWidth="2" opacity="0.7" />
      <path d="M70 80 L70 150 L130 150 L130 80 L100 55 Z" fill="#e89aa0" opacity="0.6" stroke="#8a4a48" strokeWidth="1" />
      <rect x="92" y="105" width="16" height="30" fill="#8a4a48" opacity="0.5" />
      <circle cx="100" cy="90" r="5" fill="#be185d" opacity="0.5" />
    </g>
  ),
  festa: (
    <g>
      <path d="M40 90 L40 150 L160 150 L160 90 L100 50 Z" fill="#e89aa0" opacity="0.6" stroke="#8a4a48" strokeWidth="1" />
      <rect x="60" y="105" width="20" height="25" fill="#8a4a48" opacity="0.35" />
      <rect x="90" y="105" width="20" height="25" fill="#be185d" opacity="0.4" />
      <rect x="120" y="105" width="20" height="25" fill="#8a4a48" opacity="0.35" />
      <path d="M30 90 L100 40 L170 90" stroke="#8a4a48" strokeWidth="1.5" fill="none" />
    </g>
  ),
};

// Formatos da foto: "retrato" (2:3, fotos do casal), "quadrado" ou "paisagem".
const FORMATOS = {
  retrato: { caixa: "max-w-sm", proporcao: "aspect-[2/3]", sizes: "(min-width: 768px) 24rem, 85vw" },
  quadrado: { caixa: "max-w-sm", proporcao: "aspect-square", sizes: "(min-width: 768px) 24rem, 85vw" },
  paisagem: { caixa: "max-w-lg", proporcao: "aspect-[3/2]", sizes: "(min-width: 768px) 32rem, 90vw" },
};

// Foto com moldura deslocada. Com varias fotos, elas passam em carrossel.
// Sem foto nenhuma, mostra o desenho do prototipo.
export function FotoMoldura({ src, fotos, alt, desenho = "noivos", legenda, prioridade = false, formato = "retrato" }) {
  const f = FORMATOS[formato];
  return (
    // Acabamento de quadro montado: margem clara em volta da foto e sombra leve.
    <div className={`relative w-full ${f.caixa} mx-auto bg-carta p-2.5 md:p-3 border border-dust/70 shadow-[0_22px_45px_-32px_rgba(90,46,46,0.55)]`}>
      <div className={`relative w-full ${f.proporcao} overflow-hidden border border-rose/30 bg-gradient-to-br from-blush via-petal to-dust`}>
        {fotos?.length ? (
          <CarrosselFotos fotos={fotos} alt={alt} sizes={f.sizes} />
        ) : src ? (
          <Image src={src} alt={alt} fill priority={prioridade} sizes={f.sizes} className="object-cover" />
        ) : (
          <>
            {/* O desenho ocupa a parte de cima e a legenda fica sozinha embaixo. */}
            <svg viewBox="0 20 200 150" className="absolute inset-x-0 top-[6%] w-full h-[64%] md:h-[70%]" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {DESENHOS[desenho]}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 md:pb-8 text-center px-6">
              <div className="hidden md:block w-12 h-px mb-3 bg-wine/50" />
              <p className="font-serif italic text-deep tracking-wide">{legenda}</p>
              <div className="w-12 h-px mt-3 bg-wine/50" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
