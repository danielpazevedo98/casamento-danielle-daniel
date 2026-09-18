import PaginaEvento from "@/components/PaginaEvento";
import { EVENTO } from "@/lib/evento";

export const metadata = { title: "Cerimônia · Danielle & Daniel" };

export default function Ceremonia() {
  return (
    <PaginaEvento
      sobre="ONDE TUDO COMEÇA"
      titulo="Cerimônia"
      local={EVENTO.cerimonia}
      desenho="igreja"
      legendaFoto="Foto da igreja · em breve"
    />
  );
}
