import Layout from "@/components/Layout";
import { Cabecalho, Flores, FotoMoldura } from "@/components/Enfeites";

// Layout comum de Cerimonia e Recepcao: cartao com as informacoes e, embaixo, a foto do local.
export default function PaginaEvento({ sobre, titulo, local, desenho, legendaFoto }) {
  return (
    <Layout>
      <div className="relative min-h-screen bg-blush px-6 md:px-16 pt-20 pb-16 md:py-16 overflow-hidden">
        <Flores className="absolute w-32 md:w-48 top-0 right-0" />
        <Flores className="absolute w-32 md:w-44 bottom-0 left-0 rotate-180" />
        <div className="relative max-w-5xl mx-auto">
          <Cabecalho sobre={sobre} titulo={titulo} />

          <div className="max-w-xl mx-auto">
            <div className="relative bg-carta p-6 sm:p-8 md:p-10 border border-dust shadow-[0_1px_0_#c89968,0_30px_60px_-30px_rgba(190,24,93,0.25)]">
              {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((c) => (
                <div key={c} className={`absolute w-6 h-6 border-gold ${c}`} aria-hidden="true" />
              ))}

              <div className="text-center mb-8">
                <p className="text-xs tracking-[0.5em] text-fuchsia font-sans font-medium mb-4">NOSSO ENCONTRO</p>
                <p className="font-serif text-2xl text-deep text-balance">{local.local}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-center border-t border-b border-dust py-6">
                <div>
                  <p className="text-xs tracking-[0.35em] text-fuchsia font-sans mb-2">DATA</p>
                  <p className="font-serif text-xl text-deep">27 nov</p>
                  <p className="font-serif italic text-sm text-wine">sexta · 2026</p>
                </div>
                <div className="border-l border-dust">
                  <p className="text-xs tracking-[0.35em] text-fuchsia font-sans mb-2">HORÁRIO</p>
                  <p className="font-serif text-xl text-deep">{local.horario}</p>
                  <p className="font-serif italic text-sm text-wine">pontualmente</p>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-xs tracking-[0.35em] text-fuchsia font-sans mb-2">ENDEREÇO</p>
                <p className="font-serif text-lg text-deep">{local.endereco}</p>
                <p className="font-serif italic text-wine">{local.bairro}</p>
                <p className="text-xs tracking-[0.25em] text-gold font-sans mt-2">CEP {local.cep}</p>
              </div>

              <a
                href={local.mapa}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 px-4 sm:px-7 py-3 bg-wine text-blush font-sans text-xs tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap hover:bg-fuchsia transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22s-7-7.58-7-12a7 7 0 0114 0c0 4.42-7 12-7 12z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                VER NO GOOGLE MAPS
              </a>
            </div>

            <div className="mt-14 md:mt-16 px-3 md:px-4">
              <FotoMoldura src={local.foto} alt={local.local} desenho={desenho} legenda={legendaFoto} formato="quadrado" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
