"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/inicio", label: "Início" },
  { href: "/ceremonia", label: "Cerimônia" },
  { href: "/recepcao", label: "Recepção" },
  { href: "/presentes", label: "Lista de Presentes" },
  { href: "/confirmacao", label: "Confirmar Presença" },
];

export default function Layout({ children }) {
  const [aberto, setAberto] = useState(false);
  const path = usePathname();
  const ativo = (href) => path === href || path.startsWith(href + "/");

  return (
    <div className="flex min-h-screen bg-blush">
      <button
        onClick={() => setAberto(!aberto)}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-blush rounded-full shadow-lg flex items-center justify-center text-deep"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          {aberto ? (
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" />
          ) : (
            <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.5" />
          )}
        </svg>
      </button>

      <aside
        className={`fixed md:sticky md:top-0 md:h-screen inset-y-0 left-0 z-40 w-72 shrink-0 transform transition-transform duration-500 ${
          aberto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-blush border-r border-dust/80 overflow-hidden`}
      >
        <div className="relative p-8 h-full flex flex-col">
          <div className="text-center mb-12 mt-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-fuchsia/40 flex items-center justify-center">
              <span className="font-serif italic text-2xl text-deep">D&amp;D</span>
            </div>
            <p className="font-serif text-xl italic text-deep">Danielle</p>
            <p className="font-sans text-xs tracking-widest text-fuchsia my-1">&amp;</p>
            <p className="font-serif text-xl italic text-deep">Daniel</p>
            <p className="font-sans text-xs tracking-[0.3em] text-wine mt-4">27·11·2026</p>
          </div>

          <nav className="flex-1 space-y-1">
            {ITENS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setAberto(false)}
                className={`block py-3 px-4 font-serif text-lg transition-all ${
                  ativo(it.href) ? "text-deep font-medium border-l-2 border-fuchsia pl-6" : "text-wine hover:text-deep"
                }`}
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {aberto && <div className="md:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setAberto(false)} />}

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
