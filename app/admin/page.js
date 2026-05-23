"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState("gifts");
  const [gifts, setGifts] = useState([]);
  const [guests, setGuests] = useState([]);
  const [claims, setClaims] = useState([]);
  
  useEffect(() => {
    if (auth) {
      loadData();
    }
  }, [auth]);
  
  const loadData = async () => {
    const g = await fetch("/api/gifts?all=true").then(r => r.json());
    setGifts(g);
    
    const gu = await fetch("/api/admin/guests").then(r => r.json());
    setGuests(gu);
    
    const c = await fetch("/api/admin/claims").then(r => r.json());
    setClaims(c);
  };
  
  const login = () => {
    if (pw === "danieldanielle2026") {
      setAuth(true);
    } else {
      alert("Senha incorreta");
    }
  };
  
  const toggleReserved = async (id, currentStatus) => {
    await fetch("/api/admin/toggle-gift", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id, reserved: !currentStatus })
    });
    loadData();
  };
  
  const toggleColor = async (id, currentColor) => {
    const colors = ["Verde", "Amarelo", "Vermelho"];
    const currentIndex = colors.indexOf(currentColor);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    
    await fetch("/api/admin/toggle-color", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id, color: nextColor })
    });
    loadData();
  };
  
  const toggleConfirmed = async (id, currentStatus) => {
    await fetch("/api/admin/toggle-confirmed", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id, confirmed: !currentStatus })
    });
    loadData();
  };
  
  if (!auth) {
    return (
      <div className="min-h-screen bg-blush flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-10 border border-dust shadow-lg">
          <h1 className="font-serif text-3xl text-deep text-center mb-8">Painel Admin</h1>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Senha" className="w-full py-3 px-5 border border-dust focus:outline-none focus:border-fuchsia font-serif text-lg text-deep mb-4"/>
          <button onClick={login} className="w-full py-3 bg-wine text-blush font-sans text-xs tracking-[0.3em] hover:bg-fuchsia transition-colors">ENTRAR</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-blush px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl text-deep">Painel Admin</h1>
          <button onClick={() => setAuth(false)} className="px-4 py-2 border border-wine text-wine font-sans text-xs tracking-[0.2em] hover:bg-wine hover:text-blush transition-colors">SAIR</button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 border border-dust">
            <p className="text-xs tracking-[0.2em] text-fuchsia font-sans mb-1">PRESENTES DISPONÍVEIS</p>
            <p className="font-serif text-3xl text-deep">{gifts.filter(g => !g.reserved).length}</p>
          </div>
          <div className="bg-white p-5 border border-dust">
            <p className="text-xs tracking-[0.2em] text-fuchsia font-sans mb-1">PRESENTES RESERVADOS</p>
            <p className="font-serif text-3xl text-deep">{gifts.filter(g => g.reserved).length}</p>
          </div>
          <div className="bg-white p-5 border border-dust">
            <p className="text-xs tracking-[0.2em] text-fuchsia font-sans mb-1">CONVIDADOS VERDES</p>
            <p className="font-serif text-3xl text-deep">{guests.filter(g => g.color === "Verde").length}</p>
          </div>
          <div className="bg-white p-5 border border-dust">
            <p className="text-xs tracking-[0.2em] text-fuchsia font-sans mb-1">CONFIRMADOS</p>
            <p className="font-serif text-3xl text-deep">{guests.filter(g => g.confirmed).length}</p>
          </div>
        </div>
        
        <div className="flex gap-2 mb-6 border-b border-dust pb-2">
          {[{id:"gifts",label:"Presentes"},{id:"guests",label:"Convidados"},{id:"claims",label:"Quem Presenteou"}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2 font-sans text-sm tracking-[0.15em] transition-colors ${tab === t.id ? "text-deep border-b-2 border-fuchsia" : "text-wine"}`}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
        
        {tab === "gifts" && (
          <div className="space-y-2">
            {gifts.sort((a,b) => a.price - b.price).map(g => (
              <div key={g.id} className="bg-white p-4 flex items-center gap-4 border border-dust">
                <div className="flex-1">
                  <p className="font-serif text-lg text-deep">{g.name}</p>
                  <p className="font-sans text-sm text-fuchsia font-medium">R$ {Number(g.price).toLocaleString("pt-BR", {minimumFractionDigits:2})}</p>
                </div>
                <div className="flex gap-2">
                  {g.reserved && <span className="px-3 py-1 bg-fuchsia text-blush text-xs font-sans tracking-wider">RESERVADO</span>}
                  <button onClick={() => toggleReserved(g.id, g.reserved)} className="px-4 py-2 border border-fuchsia text-fuchsia text-xs font-sans hover:bg-fuchsia hover:text-blush transition-colors">
                    {g.reserved ? "LIBERAR" : "RESERVAR"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {tab === "guests" && (
          <div className="space-y-2">
            {guests.sort((a,b) => a.name.localeCompare(b.name)).map(g => (
              <div key={g.id} className="bg-white p-4 flex items-center gap-4 border border-dust">
                <div className="flex-1">
                  <p className="font-serif text-lg text-deep">{g.name}</p>
                  {g.confirmed && <p className="font-sans text-xs text-wine italic mt-1">Confirmado por: {g.confirmed_by_name}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleColor(g.id, g.color)} className={`px-3 py-1 text-xs font-sans tracking-wider ${g.color === "Verde" ? "bg-green-500" : g.color === "Amarelo" ? "bg-yellow-500" : "bg-red-500"} text-white`}>
                    {g.color.toUpperCase()}
                  </button>
                  {g.confirmed && (
                    <button onClick={() => toggleConfirmed(g.id, g.confirmed)} className="px-4 py-2 border border-fuchsia text-fuchsia text-xs font-sans hover:bg-fuchsia hover:text-blush transition-colors">
                      DESCONFIRMAR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {tab === "claims" && (
          <div className="space-y-2">
            {claims.map((c,i) => {
              const g = gifts.find(x => x.id === c.gift_id);
              return (
                <div key={i} className="bg-white p-4 border border-dust border-l-4 border-l-fuchsia">
                  <p className="font-serif text-lg text-deep">{g?.name || "—"}</p>
                  <p className="font-sans text-sm text-wine mt-1">Por: <strong>{c.guest_name}</strong> ({c.guest_email})</p>
                  <p className="font-sans text-xs text-fuchsia mt-1">{c.method.toUpperCase()} · R$ {g?.price.toLocaleString("pt-BR", {minimumFractionDigits:2})}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
