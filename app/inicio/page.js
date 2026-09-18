import Link from "next/link";
import Layout from "@/components/Layout";
import Contagem from "@/components/Contagem";
import { Flores, FotoMoldura } from "@/components/Enfeites";
import { EVENTO } from "@/lib/evento";

export default function Inicio() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-blush">
        <div className="flex-1 grid lg:grid-cols-2">
          <div className="relative flex flex-col justify-center px-8 md:px-16 pt-20 pb-12 lg:py-16">
            <Flores className="absolute w-44 top-0 right-0" />
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-fuchsia" />
              <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium">ESTAMOS NOS CASANDO</p>
            </div>
            <h1 className="font-serif text-6xl xl:text-8xl text-deep font-light leading-none">Danielle</h1>
            <p className="font-serif italic text-3xl xl:text-4xl text-fuchsia my-3 pl-2">&amp;</p>
            <h1 className="font-serif text-6xl xl:text-8xl text-deep font-light leading-none">Daniel</h1>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-fuchsia" />
              <p className="text-sm tracking-[0.3em] text-deep font-sans">{EVENTO.dataCurta}</p>
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-fuchsia to-transparent" />
            </div>

            <p className="mt-10 max-w-lg font-serif text-xl italic text-wine leading-relaxed">
              &ldquo;De toda a gente do mundo, escolhemos nós dois.
              <br />
              De todos os dias, escolhemos este.
              <br />
              Que tal celebrar com a gente?&rdquo;
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/confirmacao" className="px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">
                CONFIRMAR PRESENÇA
              </Link>
              <Link href="/presentes" className="px-8 py-3 border border-fuchsia text-fuchsia font-sans text-xs tracking-[0.25em] hover:bg-fuchsia hover:text-blush transition-colors">
                LISTA DE PRESENTES
              </Link>
            </div>
            {EVENTO.prazoRsvp && (
              <p className="mt-5 font-sans text-xs tracking-[0.15em] text-wine">
                Confirme sua presença até {EVENTO.prazoRsvp.texto}.
              </p>
            )}
          </div>

          <div className="relative flex items-center justify-center bg-petal px-10 py-14 lg:p-12">
            <FotoMoldura src={EVENTO.fotoNoivos} alt="Danielle e Daniel" desenho="noivos" legenda="Foto dos noivos · em breve" prioridade />
            <Flores className="absolute w-40 bottom-0 right-0 rotate-180" />
          </div>
        </div>
        <Contagem />
      </div>
    </Layout>
  );
}
