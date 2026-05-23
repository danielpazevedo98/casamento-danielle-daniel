"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function PresenteDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [gift, setGift] = useState(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/gifts?all=true`).then(r => r.json()).then(data => {
      const found = data.find(g => g.id === params.id);
      setGift(found);
      setLoading(false);
    });
  }, [params.id]);
  
  const handlePix = async () => {
    if (!name || !email) { alert("Preencha nome e email"); return; }
    await fetch("/api/claim-pix", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ giftId: gift.id, name, email })
    });
    setStep(3);
  };
  
  const handleCard = async () => {
    if (!name || !email) { alert("Preencha nome e email"); return; }
    const res = await fetch("/api/mercadopago", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ giftId: gift.id, name, email })
    });
    const data = await res.json();
    window.location.href = data.init_point;
  };
  
  if (loading) return <Layout><div className="min-h-screen bg-blush flex items-center justify-center"><p className="font-serif text-xl text-wine italic">Carregando...</p></div></Layout>;
  
  if (!gift) return <Layout><div className="min-h-screen bg-blush flex items-center justify-center px-6"><div className="text-center"><h2 className="font-serif text-3xl text-deep mb-4">Presente não encontrado</h2><a href="/presentes" className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em]">VOLTAR</a></div></div></Layout>;
  
  if (gift.reserved) return <Layout><div className="min-h-screen bg-blush flex items-center justify-center px-6"><div className="text-center max-w-md"><h2 className="font-serif text-3xl text-deep mb-4">Ops!</h2><p className="font-serif text-lg text-wine mb-6">Este presente já foi escolhido por outra pessoa.</p><a href="/presentes" className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em]">VER OUTROS PRESENTES</a></div></div></Layout>;
  
  return (
    <Layout>
      <div className="min-h-screen bg-blush px-6 py-16 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 border border-dust shadow-lg">
          <button onClick={() => router.back()} className="text-wine hover:text-deep mb-6">← Voltar</button>
          
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <p className="text-xs tracking-[0.4em] text-fuchsia font-sans font-medium mb-2">VOCÊ ESCOLHEU</p>
                <h3 className="font-serif text-2xl text-deep mb-2">{gift.name}</h3>
                <p className="font-sans text-xl text-fuchsia font-medium">R$ {Number(gift.price).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" className="w-full py-3 px-5 bg-white border border-dust focus:outline-none focus:border-fuchsia font-serif text-lg text-deep"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full py-3 px-5 bg-white border border-dust focus:outline-none focus:border-fuchsia font-serif text-lg text-deep"/>
              </div>
              
              <button onClick={() => setStep(2)} className="w-full py-3 bg-wine text-blush font-sans text-xs tracking-[0.3em] hover:bg-fuchsia transition-colors">CONTINUAR</button>
            </>
          )}
          
          {step === 2 && (
            <>
              <p className="font-serif italic text-wine text-center mb-2 text-lg">Como você prefere pagar?</p>
              
              <div className="bg-blush/50 p-4 rounded mb-4 border border-dust">
                <p className="font-serif italic text-sm text-wine text-center leading-relaxed">
                  💡 <strong>Dica:</strong> Pelo Pix, o valor vai direitinho pros noivos. 
                  Pelo cartão, tem uma taxinha do Mercado Pago (mas a gente fica feliz do mesmo jeito!) 😊
                </p>
              </div>
              
              <div className="space-y-3">
                <button onClick={handlePix} className="w-full py-4 bg-wine text-blush font-sans text-sm tracking-[0.15em] hover:bg-fuchsia transition-colors flex items-center justify-between px-5">
                  <span>PIX</span>
                  <span className="text-xs opacity-75">100% pros noivos</span>
                </button>
                <button onClick={handleCard} className="w-full py-4 border border-fuchsia text-fuchsia font-sans text-sm tracking-[0.15em] hover:bg-fuchsia hover:text-blush transition-colors">
                  CARTÃO DE CRÉDITO/DÉBITO
                </button>
              </div>
            </>
          )}
          
          {step === 3 && (
            <div className="text-center">
              <p className="font-serif text-lg text-wine mb-4">Use a chave PIX abaixo:</p>
              <div className="p-5 border-2 border-dashed border-fuchsia bg-blush mb-4">
                <p className="text-xs tracking-[0.3em] text-fuchsia font-sans font-medium mb-2">CHAVE PIX · BANCO INTER</p>
                <p className="break-all font-sans text-lg text-deep font-medium">{process.env.NEXT_PUBLIC_PIX_KEY || "danielpazevedo98@gmail.com"}</p>
                <button onClick={() => { navigator.clipboard?.writeText(process.env.NEXT_PUBLIC_PIX_KEY || "danielpazevedo98@gmail.com"); alert("Chave copiada!"); }} className="mt-3 text-xs tracking-[0.3em] text-fuchsia hover:underline font-sans">COPIAR CHAVE</button>
              </div>
              <p className="font-serif italic text-wine text-sm mb-2">Valor: <strong>R$ {Number(gift.price).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</strong></p>
              <p className="font-serif italic text-wine text-sm mb-6">Já fez a transferência?</p>
              <a href="/pagamento/sucesso" className="inline-block px-8 py-3 bg-wine text-blush font-sans text-xs tracking-[0.25em] hover:bg-fuchsia transition-colors">JÁ FIZ O PIX</a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
