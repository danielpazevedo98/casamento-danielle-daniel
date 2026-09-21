import PaginaEvento from "@/components/PaginaEvento";
import { EVENTO } from "@/lib/evento";

export const metadata = { title: "Recepção · Danielle & Daniel" };

export default function Recepcao() {
  return (
    <PaginaEvento
      sobre="ONDE A FESTA ACONTECE"
      titulo="Recepção"
      local={EVENTO.recepcao}
      desenho="festa"
      legendaFoto="Foto da casa de festas · em breve"
      formatoFoto="paisagem"
    />
  );
}
