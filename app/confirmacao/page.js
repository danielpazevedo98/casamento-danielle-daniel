"use client";
import { useState } from "react";
import Layout from "@/components/Layout";

export default function Confirmacao() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  
  const handleSearch = async (q) => {
    setSearch(q);
    if (q.length < 2) { setResults([]); return; }
    const res = await fetch(`/api/search-guests?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
  };
  
  const toggleSelect = (guest) => {
    setSelected(prev => prev.some(g => g.id === guest.id) ? prev.filter(g => g.id !== guest.id) : [...prev, guest]);
    setSearch("");
    setResults([]);
  };
  
  const confirm = async () => {
    if (selected.length === 0 || !name || !email) {
      alert("Preencha todos os campos");
      return;
    }
    await fetch("/api/confirm", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ guestIds: selected.map(g => g.id), name, email })
    });
    setDone(true);
  };
  
  if (done) {
    return (
      <Layout>
        <div className="min-h-screen bg-blush flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h2 className="font-serif text-4xl text-deep italic font-light mb-4">Que alegria!</h2>
            <p className="font-serif text-lg text-wine mb-4">Presença confirmada para:</p>
            <ul className="space-y-1 mb-8">
              {selected.map(g => <li key={g.id} className="font-serif text-xl text-deep italic">{g.name}</li>)}
            </ul>
            <p className="font-serif italic text-fuchsia">Mal podemos esperar pra dançar com vocês.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-blush px-6 md:px-16 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-6 bg-fuchsia"/>
              <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium">R.S.V.P.</p>
              <div className="h-px w-6 bg-fuchsia"/>
            </div>
            <h2 className="font-serif text-5xl text-deep font-light">Confirmar Presença</h2>
            <p className="mt-6 font-serif italic text-lg text-wine">Digite seu nome (ou de quem você está confirmando).<br/>Pode confirmar mais de uma pessoa.</p>
          </div>
          
          <div className="relative mb-6">
            <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Comece a digitar o nome..." className="w-full py-3 px-5 bg-white border border-dust focus:outline-none focus:border-fuchsia font-serif text-lg text-deep"/>
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-dust shadow-lg max-h-64 overflow-y-auto z-10">
                {results.map(g => (
                  <button key={g.id} onClick={() => toggleSelect(g)} className="w-full text-left px-5 py-3 hover:bg-petal border-b border-dust/50 font-serif text-lg text-deep">{g.name}</button>
                ))}
              </div>
            )}
          </div>
          
          {selected.length > 0 && (
            <div className="mt-8">
              <p className="text-xs tracking-[0.3em] text-fuchsia font-sans font-medium mb-3">CONFIRMANDO PRESENÇA DE</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {selected.map(g => (
                  <span key={g.id} className="inline-flex items-center gap-2 pl-4 pr-2 py-2 bg-wine text-blush font-serif border-l-2 border-fuchsia">
                    {g.name}
                    <button onClick={() => toggleSelect(g)} className="w-5 h-5 flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2"/></svg></button>
                  </span>
                ))}
              </div>
              
              <p className="font-serif italic text-wine mb-4">Agora só falta saber quem está fazendo a confirmação:</p>
              <div className="space-y-4 mb-6">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" className="w-full py-3 px-5 bg-white border border-dust focus:outline-none focus:border-fuchsia font-serif text-lg text-deep"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full py-3 px-5 bg-white border border-dust focus:outline-none focus:border-fuchsia font-serif text-lg text-deep"/>
              </div>
              
              <button onClick={confirm} className="w-full py-4 bg-wine text-blush font-sans text-xs tracking-[0.3em] hover:bg-fuchsia transition-colors">CONFIRMAR PRESENÇA</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
