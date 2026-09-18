import Link from "next/link";
import Layout from "@/components/Layout";

// Tela simples de mensagem, usada nas paginas de retorno do pagamento.
export default function TelaRecado({ icone, titulo, children, link = "/inicio", textoLink = "VOLTAR AO SITE" }) {
  return (
    <Layout>
      <div className="min-h-screen bg-blush flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md">
          {icone && <div className="text-5xl mb-6" aria-hidden="true">{icone}</div>}
          <h2 className="font-serif text-4xl text-deep mb-4">{titulo}</h2>
          <div className="font-serif text-lg text-wine mb-8 space-y-3">{children}</div>
          <Link href={link} className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">
            {textoLink}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
