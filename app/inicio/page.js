import Link from "next/link";
import Layout from "@/components/Layout";
import Contagem from "@/components/Contagem";
import { Divisor, Flores, FotoMoldura } from "@/components/Enfeites";
import { EVENTO } from "@/lib/evento";

// Uma coluna so: nomes e convite em cima, foto dos noivos embaixo, contagem no fim.
export default function Inicio() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-blush">
        <section className="relative overflow-hidden px-6 md:px-16 pt-20 pb-14 md:pt-24 md:pb-20 text-center">
          <Flores canto="direita" />
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-fuchsia" />
              <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium">ESTAMOS NOS CASANDO</p>
              <div className="h-px w-8 bg-fuchsia" />
            </div>
            <h1 className="font-serif text-6xl md:text-8xl text-deep font-light leading-none">Danielle</h1>
            <p className="font-serif italic text-3xl md:text-4xl text-fuchsia my-3">&amp;</p>
            <h1 className="font-serif text-6xl md:text-8xl text-deep font-light leading-none">Daniel</h1>

            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-fuchsia" />
              <p className="text-sm tracking-[0.3em] text-deep font-sans">{EVENTO.dataCurta}</p>
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-fuchsia to-transparent" />
            </div>

            <p className="mt-10 max-w-lg mx-auto font-serif text-lg md:text-xl italic text-wine leading-relaxed text-balance">
              &ldquo;De toda a gente do mundo, escolhemos nós dois.
              <br />
              De todos os dias, escolhemos este.
              <br />
              Que tal celebrar com a gente?&rdquo;
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/confirmacao" className="w-64 sm:w-auto text-center px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">
                CONFIRMAR PRESENÇA
              </Link>
              <Link href="/presentes" className="w-64 sm:w-auto text-center px-8 py-3 border border-fuchsia text-fuchsia font-sans text-xs tracking-[0.25em] hover:bg-fuchsia hover:text-blush transition-colors">
                LISTA DE PRESENTES
              </Link>
            </div>
            {EVENTO.prazoRsvp && (
              <p className="mt-5 font-sans text-xs tracking-[0.15em] text-wine">
                Confirme sua presença até {EVENTO.prazoRsvp.texto}.
              </p>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden px-10 pb-4 md:pb-8">
          <FotoMoldura fotos={EVENTO.fotosNoivos} alt="Danielle e Daniel" desenho="noivos" legenda="Foto dos noivos · em breve" prioridade />
        </section>

        <section className="relative overflow-hidden px-6 py-14 md:py-16">
          <Flores canto="esquerda" />
          <div className="max-w-xl mx-auto bg-carta border border-dust p-8 md:p-10 text-center shadow-[0_1px_0_#c89968,0_30px_60px_-30px_rgba(138,74,72,0.2)]">
            <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium">TRAJE</p>
            <p className="font-serif text-3xl text-deep mt-3">{EVENTO.traje.titulo}</p>
            <Divisor />
            <p className="mt-3 font-serif italic text-lg text-wine leading-relaxed text-balance">{EVENTO.traje.recado}</p>
          </div>
        </section>

        <Contagem />
      </div>
    </Layout>
  );
}
