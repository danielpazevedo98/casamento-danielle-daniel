"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { Cabecalho } from "@/components/Enfeites";
import IlustracaoPresente from "@/components/IlustracaoPresente";
import { CATEGORIAS, FAIXAS, naFaixa } from "@/lib/evento";
import { normalizar, reais } from "@/lib/formato";

const controle =
  "py-3 px-4 bg-white border border-dust focus:outline-none focus:border-fuchsia font-sans text-sm text-deep";

export default function Presentes() {
  const [presentes, setPresentes] = useState(null);
  const [erro, setErro] = useState(false);
  const [busca, setBusca] = useState("");
  const [faixa, setFaixa] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ordem, setOrdem] = useState("menor");

  useEffect(() => {
    fetch("/api/presentes")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setPresentes(d.presentes))
      .catch(() => setErro(true));
  }, []);

  const lista = useMemo(() => {
    if (!presentes) return [];
    const q = normalizar(busca).trim();
    return presentes
      .filter(
        (p) =>
          (!q || normalizar(p.nome + " " + (p.descricao || "")).includes(q)) &&
          naFaixa(p.preco, faixa) &&
          (!categoria || p.categoria === categoria)
      )
      .sort((a, b) => (ordem === "menor" ? a.preco - b.preco : b.preco - a.preco));
  }, [presentes, busca, faixa, categoria, ordem]);

  const filtrando = busca || faixa || categoria;

  return (
    <Layout>
      <div className="min-h-screen bg-blush px-6 md:px-16 pt-20 pb-16 md:py-16">
        <div className="max-w-6xl mx-auto">
          <Cabecalho sobre="COM CARINHO" titulo="Lista de Presentes">
            Sua presença já é o nosso maior presente. Mas, se quiser deixar um carinho extra, escolha um dos
            &ldquo;presentes&rdquo; abaixo: o valor vai direto para os noivos começarem a vida a dois. Cada presente só pode ser escolhido uma vez.
          </Cabecalho>

          <div className="bg-white/70 border border-dust p-4 md:p-5 mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar presente..."
                className={`${controle} flex-1`}
              />
              <select value={faixa} onChange={(e) => setFaixa(e.target.value)} className={controle} aria-label="Faixa de preço">
                {FAIXAS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)} className={controle} aria-label="Ordenar">
                <option value="menor">Menor preço primeiro</option>
                <option value="maior">Maior preço primeiro</option>
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[{ nome: "" }, ...CATEGORIAS].map((c) => (
                <button
                  key={c.nome || "todas"}
                  onClick={() => setCategoria(c.nome)}
                  aria-pressed={categoria === c.nome}
                  className={`px-4 py-2 font-sans text-xs tracking-[0.15em] border transition-colors ${
                    categoria === c.nome ? "bg-wine text-blush border-wine" : "border-dust text-wine hover:border-wine bg-white"
                  }`}
                >
                  {(c.nome || "Todos").toUpperCase()}
                </button>
              ))}
              {presentes && (
                <span className="ml-auto font-sans text-xs text-wine/80">
                  {filtrando ? `${lista.length} de ${presentes.length} presentes` : `${presentes.length} presentes disponíveis`}
                </span>
              )}
            </div>
          </div>

          {erro ? (
            <p className="text-center font-serif text-xl text-wine italic">Não consegui carregar a lista. Recarregue a página.</p>
          ) : !presentes ? (
            <p className="text-center font-serif text-xl text-wine italic">Carregando presentes...</p>
          ) : presentes.length === 0 ? (
            <p className="text-center font-serif text-xl text-wine italic">Todos os presentes já foram escolhidos. Muito obrigado! 💝</p>
          ) : lista.length === 0 ? (
            <div className="text-center">
              <p className="font-serif text-xl text-wine italic mb-4">Nenhum presente com esses filtros.</p>
              <button
                onClick={() => { setBusca(""); setFaixa(""); setCategoria(""); }}
                className="font-sans text-xs tracking-[0.2em] text-fuchsia hover:underline"
              >
                LIMPAR FILTROS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {lista.map((p) => (
                <Link
                  key={p.id}
                  href={`/presentes/${p.id}`}
                  className="group bg-white border border-dust hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="overflow-hidden">
                    <div className="transition-transform duration-500 group-hover:scale-105">
                      <IlustracaoPresente presente={p} />
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-[0.65rem] tracking-[0.3em] text-fuchsia font-sans mb-2">{(p.categoria || "").toUpperCase()}</p>
                    <h3 className="font-serif text-xl text-deep leading-snug mb-2">{p.nome}</h3>
                    {p.descricao && <p className="font-serif italic text-wine mb-4 flex-1">{p.descricao}</p>}
                    <div className="flex items-center justify-between gap-3 mt-auto pt-2">
                      <p className="font-sans text-lg text-fuchsia font-medium">{reais(p.preco)}</p>
                      <span className="px-5 py-2 bg-wine text-blush font-sans text-xs tracking-[0.25em] group-hover:bg-fuchsia transition-colors">
                        PRESENTEAR
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
