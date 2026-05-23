"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";

export default function Presentes() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("/api/gifts").then(r => r.json()).then(data => {
      setGifts(data);
      setLoading(false);
    });
  }, []);
  
  if (loading) return <Layout><div className="min-h-screen bg-blush flex items-center justify-center"><p className="font-serif text-xl text-wine italic">Carregando presentes...</p></div></Layout>;
  
  return (
    <Layout>
      <div className="min-h-screen bg-blush px-6 md:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-6 bg-fuchsia"/>
              <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium">COM CARINHO</p>
              <div className="h-px w-6 bg-fuchsia"/>
            </div>
            <h2 className="font-serif text-5xl text-deep font-light">Lista de Presentes</h2>
            <p className="mt-6 font-serif italic text-lg text-wine max-w-xl mx-auto">Sua presença já é o nosso maior presente.<br/>Mas se quiser deixar um carinho extra, escolha o que combina com você.</p>
          </div>
          
          {gifts.length === 0 ? (
            <p className="text-center font-serif text-xl text-wine italic">Todos os presentes já foram escolhidos · obrigado!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map(g => (
                <div key={g.id} className="bg-white p-6 border border-dust hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-petal to-dust mb-4 flex items-center justify-center">
                    <p className="font-serif text-4xl text-wine/30">{g.name.charAt(0)}</p>
                  </div>
                  <h3 className="font-serif text-xl text-deep mb-2 min-h-[3rem]">{g.name}</h3>
                  <p className="font-sans text-lg text-fuchsia font-medium mb-4">R$ {Number(g.price).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</p>
                  <a href={`/presentes/${g.id}`} className="block w-full py-3 text-center bg-wine text-blush font-sans text-xs tracking-[0.3em] hover:bg-fuchsia transition-colors">PRESENTEAR</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
