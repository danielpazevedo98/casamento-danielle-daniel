"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Pecas visuais do admin (port do admin.html do cha de panela).

export const cls = {
  btn: "px-4 py-2.5 bg-wine text-blush font-sans text-xs tracking-[0.12em] hover:bg-fuchsia transition-colors disabled:opacity-50 whitespace-nowrap",
  btnSec: "px-4 py-2.5 border border-wine text-wine bg-white font-sans text-xs tracking-[0.12em] hover:bg-blush transition-colors disabled:opacity-50 whitespace-nowrap",
  mini: "px-2.5 py-1 text-[11px] font-sans font-medium border border-dust text-wine bg-white hover:border-wine hover:text-deep whitespace-nowrap disabled:opacity-50",
  miniPerigo: "px-2.5 py-1 text-[11px] font-sans font-medium border border-dust text-wine bg-white hover:border-red-700 hover:text-red-700 whitespace-nowrap",
  campo: "w-full px-3 py-2.5 border border-dust bg-white text-deep font-sans text-sm focus:outline-none focus:border-fuchsia",
  filtro: "px-3 py-2.5 border border-dust bg-white text-deep font-sans text-sm focus:outline-none focus:border-fuchsia",
  th: "text-left px-3 py-2.5 font-sans font-medium text-[11px] tracking-[0.12em] uppercase",
  td: "px-3 py-2.5 border-t border-dust/70 align-middle",
  sub: "text-[11.5px] text-wine/70",
};

// Para usar dentro de onSalvar: mostra o aviso e mantem o modal aberto.
export const falhou = (aviso, texto) => {
  aviso(texto);
  return false;
};

// Mensagem rapida no rodape da tela.
const AvisoCtx = createContext(() => {});
export const useAviso = () => useContext(AvisoCtx);

export function AvisoProvider({ children }) {
  const [aviso, setAviso] = useState(null);
  // Funcao estavel: quem depende dela (ex.: recarregar) nao roda de novo a cada aviso.
  const avisar = useCallback((texto) => setAviso({ texto, id: Date.now() }), []);
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3200);
    return () => clearTimeout(t);
  }, [aviso]);
  return (
    <AvisoCtx.Provider value={avisar}>
      {children}
      {aviso && (
        <div role="status" className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[60] bg-wine text-blush px-5 py-3 font-sans text-sm shadow-lg max-w-[90vw] text-center">
          {aviso.texto}
        </div>
      )}
    </AvisoCtx.Provider>
  );
}

export function Modal({ titulo, onFechar, children }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onFechar]);
  return (
    <div
      className="fixed inset-0 z-50 bg-deep/50 flex items-center justify-center p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div role="dialog" aria-modal="true" aria-label={titulo} className="bg-white w-full max-w-md max-h-[88vh] overflow-y-auto p-6 shadow-xl">
        <h3 className="font-serif text-2xl text-deep mb-4">{titulo}</h3>
        {children}
      </div>
    </div>
  );
}

// Modal com Cancelar / Salvar. onSalvar devolve false para manter aberto.
export function ModalAcao({ titulo, onFechar, onSalvar, textoSalvar = "Salvar", children }) {
  const [salvando, setSalvando] = useState(false);
  const salvar = async () => {
    setSalvando(true);
    const ok = await onSalvar();
    setSalvando(false);
    if (ok !== false) onFechar();
  };
  return (
    <Modal titulo={titulo} onFechar={onFechar}>
      <div className="font-sans text-sm text-deep leading-relaxed">{children}</div>
      <div className="flex gap-3 mt-6">
        <button className={`${cls.btnSec} flex-1`} onClick={onFechar}>Cancelar</button>
        <button className={`${cls.btn} flex-1`} disabled={salvando} onClick={salvar}>
          {salvando ? "Salvando..." : textoSalvar}
        </button>
      </div>
    </Modal>
  );
}

export const Rotulo = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block mt-3 mb-1 font-sans text-[11px] font-medium tracking-[0.12em] uppercase text-wine">
    {children}
  </label>
);

export const Aviso = ({ children }) => (
  <div className="mt-3 bg-red-50 text-red-800 px-3 py-2.5 text-[13px] leading-relaxed">{children}</div>
);

const TAGS = {
  vai: "bg-green-50 text-green-800",
  nao_vai: "bg-red-50 text-red-800",
  pendente: "bg-stone-100 text-stone-600",
  Verde: "bg-green-50 text-green-800",
  Amarelo: "bg-amber-50 text-amber-800",
  Vermelho: "bg-red-50 text-red-800",
  confirmado: "bg-green-50 text-green-800",
  cancelado: "bg-red-50 text-red-800",
  destaque: "bg-petal text-deep",
};

export const Tag = ({ tipo, children }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-sans font-medium whitespace-nowrap ${TAGS[tipo] || TAGS.pendente}`}>
    {children}
  </span>
);

export const TagPresenca = ({ p }) =>
  p === "vai" ? <Tag tipo="vai">Vai</Tag> : p === "nao_vai" ? <Tag tipo="nao_vai">Não vai</Tag> : <Tag>Pendente</Tag>;

export const Cartao = ({ n, r, cor = "" }) => (
  <div className="bg-white border border-dust px-4 py-3.5">
    <div className={`font-serif text-3xl leading-tight ${cor || "text-fuchsia"}`}>{n}</div>
    <div className="font-sans text-[11px] tracking-[0.1em] text-wine mt-1">{r}</div>
  </div>
);

export const Secao = ({ children }) => (
  <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-wine mt-8 mb-3">{children}</h2>
);

export function Tabela({ cabecalho, children, vazio, colunas }) {
  return (
    <div className="bg-white border border-dust overflow-x-auto">
      <table className="w-full font-sans text-[13px] text-deep">
        <thead className="bg-wine text-blush">
          <tr>{cabecalho}</tr>
        </thead>
        <tbody>
          {children}
          {vazio && (
            <tr>
              <td colSpan={colunas} className="text-center text-wine/70 py-8">{vazio}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export const Barra = ({ children }) => <div className="flex flex-wrap items-center gap-2 mb-3">{children}</div>;

export const Contador = ({ children }) => (
  <span className="font-sans text-xs text-wine/80 w-full md:w-auto md:ml-auto">{children}</span>
);
