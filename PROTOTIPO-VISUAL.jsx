import { useState, useEffect } from "react";

// ============== CONFIG ==============
const WEDDING = {
  ceremonia: {
    local: "Igreja Sagrado Coração de Jesus",
    horario: "19h00",
    endereco: "Rua Carolina Santos, 143",
    cep: "20720-310",
    bairro: "Lins de Vasconcelos · Rio de Janeiro",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Igreja+Sagrado+Cora%C3%A7%C3%A3o+de+Jesus+Rua+Carolina+Santos+143+Rio+de+Janeiro",
  },
  recepcao: {
    local: "Casa de Festas Monet",
    horario: "21h30",
    endereco: "Rua São Francisco Xavier, 957",
    cep: "20550-017",
    bairro: "Maracanã · Rio de Janeiro",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Casa+de+Festas+Monet+Rua+S%C3%A3o+Francisco+Xavier+957+Maracan%C3%A3+Rio+de+Janeiro",
  },
  pixKey: "danielpazevedo98@gmail.com",
};

const ADMIN_PASSWORD = "danieldanielle2026";

const DEFAULT_GIFTS = [
  { id: "g1", name: "Jogo de Panelas Tramontina", price: 890, icon: "panela" },
  { id: "g2", name: "Jogo de Taças de Cristal", price: 420, icon: "taca" },
  { id: "g3", name: "Cafeteira Expresso", price: 1290, icon: "cafe" },
  { id: "g4", name: "Liquidificador Premium", price: 560, icon: "liquid" },
  { id: "g5", name: "Jogo de Cama King Size", price: 780, icon: "cama" },
  { id: "g6", name: "Jogo de Toalhas Bordadas", price: 350, icon: "toalha" },
  { id: "g7", name: "Air Fryer Digital", price: 720, icon: "airfryer" },
  { id: "g8", name: "Faqueiro Inox 60 peças", price: 480, icon: "faca" },
  { id: "g9", name: "Aparelho de Jantar Porcelana", price: 1150, icon: "prato" },
  { id: "g10", name: "Lua de Mel — Cota Aérea", price: 500, icon: "aviao" },
  { id: "g11", name: "Lua de Mel — Cota Hospedagem", price: 800, icon: "hotel" },
  { id: "g12", name: "Robô Aspirador", price: 1850, icon: "robo" },
];

const DEFAULT_GUESTS = [
  "Daniel Silva Pereira", "Daniela Pereira Costa", "Daniel Augusto Santos",
  "Danilo Mendes Ribeiro", "Daniella Souza Carvalho", "Mariana Souza",
  "Marina Costa Andrade", "Mário Sérgio Albuquerque", "Ana Beatriz Lima",
  "Ana Carolina Ferreira", "Anderson Rodrigues", "Antônio Henrique Pereira",
  "Beatriz Pereira Souza", "Bruno Lima Costa", "Camila Almeida Rocha",
  "Carlos Eduardo Martins", "Carolina Mendes", "Eduarda Vasconcelos",
  "Felipe Augusto Cardoso", "Fernanda Ribeiro", "Gabriel Henrique Souza",
  "Gabriela Martins Lima", "Helena Carvalho", "Isabela Cristina Nunes",
  "João Paulo Andrade", "Júlia Fernandes", "Larissa Mendonça", "Letícia Soares",
  "Lucas Vinícius Barbosa", "Luísa Tavares", "Marcos Vinícius Pereira",
  "Patrícia Helena Gomes", "Pedro Henrique Alves", "Rafael Cardoso",
  "Renata Figueiredo", "Rodrigo Almeida", "Sofia Bernardes", "Thiago Moreira",
  "Vinícius Couto", "Yasmin Oliveira",
].map((name, i) => ({ id: `gu${i}`, name }));

// ============== STORAGE ==============
async function loadState(key, fallback) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch { return fallback; }
}
async function saveState(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); } catch (e) { console.error(e); }
}

// ============== PALETA v3 ==============
// Fundos rosados, mais saturados
// #fce4e0 - rosa balé (fundo principal)
// #f8d0c8 - rosa pálido (seções)
// #efb5ab - rosa empoeirado (cartões)
// #e89aa0 - rosa antigo (bordas marcadas)
// Texto / vinho
// #8a4a48 - vinho suave
// #5a2e2e - vinho profundo
// Acentos pink / fúcsia (uso pontual e elegante)
// #ec4899 - pink vivo
// #be185d - fúcsia profundo (mais elegante que o magenta puro)
// Dourado
// #c89968 - champagne quente

// ============== DECORAÇÕES ==============
const Leaf = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 64 120" className={className} style={style} fill="none">
    <path d="M32 4 C 12 30, 8 70, 32 116 C 56 70, 52 30, 32 4 Z" fill="currentColor" opacity="0.18" />
    <path d="M32 10 L32 110" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
    {[20, 35, 50, 65, 80, 95].map((y, i) => (
      <g key={i}>
        <path d={`M32 ${y} Q 20 ${y + 4}, 14 ${y + 10}`} stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        <path d={`M32 ${y} Q 44 ${y + 4}, 50 ${y + 10}`} stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      </g>
    ))}
  </svg>
);

const FloralCorner = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 200 200" className={className} style={style} fill="none">
    <g opacity="0.55">
      {/* peonia central com toque fúcsia */}
      <circle cx="40" cy="40" r="16" fill="#e89aa0" opacity="0.5" />
      <circle cx="40" cy="40" r="10" fill="#be185d" opacity="0.35" />
      <circle cx="40" cy="40" r="5" fill="#ec4899" opacity="0.5" />
      <circle cx="40" cy="40" r="2" fill="#be185d" opacity="0.8" />
      {/* pétalas em volta */}
      <ellipse cx="70" cy="35" rx="18" ry="6" fill="#e89aa0" opacity="0.35" transform="rotate(-25 70 35)" />
      <ellipse cx="60" cy="65" rx="15" ry="5" fill="#c89968" opacity="0.35" transform="rotate(40 60 65)" />
      <ellipse cx="30" cy="70" rx="12" ry="4" fill="#ec4899" opacity="0.25" transform="rotate(-70 30 70)" />
      {/* botão fúcsia */}
      <circle cx="80" cy="60" r="4" fill="#be185d" opacity="0.5" />
      <circle cx="25" cy="90" r="3" fill="#ec4899" opacity="0.5" />
      {/* hastes */}
      <path d="M 40 50 Q 50 80, 30 110" stroke="#8a4a48" strokeWidth="0.7" opacity="0.4" />
      <path d="M 50 60 Q 70 90, 60 130" stroke="#8a4a48" strokeWidth="0.7" opacity="0.4" />
    </g>
  </svg>
);

const Monogram = ({ size = 80 }) => (
  <svg viewBox="0 0 120 120" width={size} height={size}>
    {/* anel externo dourado */}
    <circle cx="60" cy="60" r="56" fill="none" stroke="#c89968" strokeWidth="0.8" opacity="0.6" />
    {/* anel intermediário fúcsia sutil */}
    <circle cx="60" cy="60" r="52" fill="none" stroke="#be185d" strokeWidth="0.4" opacity="0.4" />
    <circle cx="60" cy="60" r="48" fill="none" stroke="#c89968" strokeWidth="0.4" opacity="0.4" />
    {/* texto vinho com leve gradiente para fúcsia */}
    <defs>
      <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5a2e2e" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
    </defs>
    <text x="60" y="74" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="36" fontStyle="italic" fill="url(#monoGrad)" fontWeight="500">
      D & D
    </text>
  </svg>
);

const Divider = ({ wide = false }) => (
  <div className="flex items-center justify-center gap-3 my-3">
    <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #c89968)", width: wide ? "70px" : "45px", opacity: 0.7 }} />
    <svg width="12" height="12" viewBox="0 0 10 10">
      <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#be185d" opacity="0.85" />
    </svg>
    <div className="h-px" style={{ background: "linear-gradient(90deg, #c89968, transparent)", width: wide ? "70px" : "45px", opacity: 0.7 }} />
  </div>
);

const PhotoPlaceholder = ({ label, ratio = "4/5", icon = "couple" }) => {
  const icons = {
    couple: (
      <g>
        <circle cx="80" cy="70" r="22" fill="#e89aa0" opacity="0.6" />
        <circle cx="120" cy="70" r="22" fill="#8a4a48" opacity="0.45" />
        <path d="M50 130 Q 80 100 100 115 Q 120 100 150 130 L 150 160 L 50 160 Z" fill="#8a4a48" opacity="0.35" />
      </g>
    ),
    church: (
      <g>
        <path d="M100 30 L100 60 M90 45 L110 45" stroke="#8a4a48" strokeWidth="2" opacity="0.7" />
        <path d="M70 80 L70 150 L130 150 L130 80 L100 55 Z" fill="#e89aa0" opacity="0.6" stroke="#8a4a48" strokeWidth="1" />
        <rect x="92" y="105" width="16" height="30" fill="#8a4a48" opacity="0.5" />
        <circle cx="100" cy="90" r="5" fill="#be185d" opacity="0.5" />
      </g>
    ),
    venue: (
      <g>
        <path d="M40 90 L40 150 L160 150 L160 90 L100 50 Z" fill="#e89aa0" opacity="0.6" stroke="#8a4a48" strokeWidth="1" />
        <rect x="60" y="105" width="20" height="25" fill="#8a4a48" opacity="0.35" />
        <rect x="90" y="105" width="20" height="25" fill="#be185d" opacity="0.4" />
        <rect x="120" y="105" width="20" height="25" fill="#8a4a48" opacity="0.35" />
        <path d="M30 90 L100 40 L170 90" stroke="#8a4a48" strokeWidth="1.5" fill="none" />
      </g>
    ),
  };
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio, background: "linear-gradient(135deg, #fce4e0 0%, #f8d0c8 50%, #efb5ab 100%)" }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`grain-${icon}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.3" fill="#8a4a48" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#grain-${icon})`} />
        {icons[icon]}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="w-12 h-px mb-3" style={{ background: "#8a4a48", opacity: 0.5 }} />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#5a2e2e", fontSize: "0.95rem", letterSpacing: "0.05em" }}>{label}</p>
        <div className="w-12 h-px mt-3" style={{ background: "#8a4a48", opacity: 0.5 }} />
      </div>
    </div>
  );
};

const GiftArt = ({ icon }) => {
  const colors = {
    panela: ["#d4a8a0", "#8a4a48"], taca: ["#e8c4cc", "#9e3e6e"], cafe: ["#b88878", "#5c3528"],
    liquid: ["#c4b8a8", "#7a6a5c"], cama: ["#f0c4b8", "#a8826b"], toalha: ["#e0c4d0", "#8e5e7a"],
    airfryer: ["#e8b8b8", "#8e5c5c"], faca: ["#c0b0b8", "#5c5050"], prato: ["#e8d0c8", "#a8826b"],
    aviao: ["#d0b0c0", "#8a4a78"], hotel: ["#dca878", "#8e6f47"], robo: ["#c0b0c8", "#7a5c8e"],
  };
  const [c1, c2] = colors[icon] || ["#c4a87a", "#8a4a48"];
  const shapes = {
    panela: <g><ellipse cx="100" cy="120" rx="50" ry="10" fill={c2} opacity="0.4" /><path d="M50 80 L150 80 L145 130 L55 130 Z" fill={c2} opacity="0.85" /><ellipse cx="100" cy="80" rx="50" ry="10" fill={c1} /><rect x="30" y="78" width="20" height="6" fill={c2} /><rect x="150" y="78" width="20" height="6" fill={c2} /><circle cx="100" cy="70" r="6" fill={c1} /></g>,
    taca: <g><path d="M75 50 L75 90 Q 100 110 125 90 L 125 50 Z" fill={c1} opacity="0.7" /><ellipse cx="100" cy="50" rx="25" ry="4" fill={c2} opacity="0.4" /><rect x="98" y="95" width="4" height="35" fill={c2} /><ellipse cx="100" cy="135" rx="20" ry="3" fill={c2} /></g>,
    cafe: <g><path d="M70 70 L70 130 L130 130 L130 70" fill={c1} /><ellipse cx="100" cy="70" rx="30" ry="6" fill={c2} opacity="0.5" /><path d="M130 85 Q 150 90 150 105 Q 150 120 130 115" fill="none" stroke={c2} strokeWidth="4" /><rect x="85" y="90" width="30" height="20" fill={c2} opacity="0.4" /></g>,
    liquid: <g><path d="M80 50 L80 100 L120 100 L120 50 Z" fill={c1} opacity="0.6" /><path d="M70 100 L70 130 L130 130 L130 100 Z" fill={c2} /><circle cx="100" cy="115" r="6" fill={c1} /></g>,
    cama: <g><rect x="40" y="90" width="120" height="40" fill={c2} /><rect x="50" y="80" width="100" height="15" fill={c1} /><rect x="55" y="65" width="35" height="20" rx="3" fill={c1} opacity="0.7" /><rect x="110" y="65" width="35" height="20" rx="3" fill={c1} opacity="0.7" /></g>,
    toalha: <g><path d="M60 60 L140 60 L140 140 L60 140 Z" fill={c1} /><path d="M60 75 L140 75 M60 125 L140 125" stroke={c2} strokeWidth="2" /></g>,
    airfryer: <g><rect x="60" y="60" width="80" height="80" rx="10" fill={c2} /><circle cx="100" cy="100" r="22" fill={c1} /><circle cx="100" cy="100" r="12" fill={c2} opacity="0.5" /></g>,
    faca: <g><rect x="95" y="50" width="4" height="60" fill={c1} /><rect x="90" y="105" width="14" height="25" fill={c2} /></g>,
    prato: <g><ellipse cx="100" cy="100" rx="50" ry="12" fill={c2} /><ellipse cx="100" cy="95" rx="50" ry="12" fill={c1} /><ellipse cx="100" cy="95" rx="38" ry="9" fill={c2} opacity="0.3" /></g>,
    aviao: <g><path d="M50 100 L160 95 L155 110 L60 115 Z" fill={c1} /><path d="M85 95 L70 70 L80 70 L100 90" fill={c2} /><path d="M85 110 L70 130 L80 130 L100 115" fill={c2} /></g>,
    hotel: <g><rect x="60" y="60" width="80" height="80" fill={c1} /><rect x="70" y="75" width="12" height="12" fill={c2} /><rect x="94" y="75" width="12" height="12" fill={c2} /><rect x="118" y="75" width="12" height="12" fill={c2} /><rect x="92" y="120" width="16" height="20" fill={c2} opacity="0.7" /></g>,
    robo: <g><ellipse cx="100" cy="105" rx="45" ry="20" fill={c2} /><ellipse cx="100" cy="100" rx="45" ry="20" fill={c1} /><circle cx="100" cy="100" r="8" fill={c2} /></g>,
  };
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1", background: `linear-gradient(135deg, ${c1}60 0%, ${c1}80 50%, ${c2}50 100%)` }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">{shapes[icon] || shapes.panela}</svg>
    </div>
  );
};

// ============== SIDEBAR ==============
const Sidebar = ({ current, setPage, onAdminClick, isMobileOpen, setMobileOpen }) => {
  const items = [
    { id: "home", label: "Início" },
    { id: "ceremonia", label: "Cerimônia" },
    { id: "recepcao", label: "Recepção" },
    { id: "presentes", label: "Lista de Presentes" },
    { id: "confirmacao", label: "Confirmar Presença" },
  ];
  return (
    <>
      <button onClick={() => setMobileOpen(!isMobileOpen)} className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full shadow-lg" style={{ background: "#fce4e0", color: "#5a2e2e" }} aria-label="Menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          {isMobileOpen ? <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" /> : <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.5" />}
        </svg>
      </button>
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-72 transform transition-transform duration-500 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg, #fce4e0 0%, #f8d0c8 100%)", borderRight: "1px solid #e89aa0" }}>
        <div className="relative h-full flex flex-col p-8">
          <FloralCorner className="absolute" style={{ width: 140, top: -20, right: -20, transform: "scaleX(-1)" }} />
          <Leaf className="absolute" style={{ color: "#be185d", width: 50, bottom: 40, left: -15, transform: "rotate(-160deg)", opacity: 0.5 }} />

          <div className="flex flex-col items-center mb-12 mt-4">
            <Monogram size={90} />
            <div className="mt-4 text-center" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#5a2e2e" }}>
              <p style={{ fontSize: "1.4rem", fontStyle: "italic", lineHeight: 1 }}>Danielle</p>
              <p style={{ fontSize: "0.85rem", letterSpacing: "0.3em", margin: "4px 0", color: "#be185d", opacity: 0.8 }}>&</p>
              <p style={{ fontSize: "1.4rem", fontStyle: "italic", lineHeight: 1 }}>Daniel</p>
            </div>
            <p className="mt-4 text-xs tracking-widest" style={{ color: "#8a4a48", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.3em" }}>
              27 · 11 · 2026
            </p>
          </div>

          <nav className="flex-1 flex flex-col gap-1">
            {items.map((it) => (
              <button key={it.id} onClick={() => { setPage(it.id); setMobileOpen(false); }}
                className="text-left py-3 px-4 transition-all duration-300 relative group"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem",
                  color: current === it.id ? "#5a2e2e" : "#8a4a48",
                  fontWeight: current === it.id ? 500 : 400 }}>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-px transition-all duration-500"
                  style={{ background: "#be185d", width: current === it.id ? "12px" : "0px" }} />
                <span style={{ paddingLeft: current === it.id ? "20px" : "0px", transition: "padding-left 0.4s ease", display: "inline-block" }}>
                  {it.label}
                </span>
              </button>
            ))}
          </nav>

          <button onClick={onAdminClick} className="text-xs tracking-widest opacity-40 hover:opacity-80 transition-opacity self-center mt-4"
            style={{ color: "#5a2e2e", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.25em" }}>
            · admin ·
          </button>
        </div>
      </aside>
      {isMobileOpen && <div className="md:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setMobileOpen(false)} />}
    </>
  );
};

// ============== HOME ==============
const HomePage = () => (
  <div className="min-h-screen flex flex-col" style={{ background: "#fce4e0" }}>
    <div className="flex-1 grid md:grid-cols-2 gap-0">
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 relative">
        <FloralCorner className="absolute" style={{ width: 180, top: 0, right: 0 }} />

        {/* eyebrow com toque pink */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: "#be185d" }} />
          <p className="text-xs tracking-[0.4em]" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>
            ESTAMOS NOS CASANDO
          </p>
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#5a2e2e", lineHeight: 1, fontWeight: 300 }}>
          Danielle
        </h1>
        <p className="my-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#be185d", paddingLeft: "0.4em" }}>
          &
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#5a2e2e", lineHeight: 1, fontWeight: 300 }}>
          Daniel
        </h1>

        <div className="mt-10 flex items-center gap-4">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, #be185d)" }} />
          <p className="text-sm tracking-[0.3em]" style={{ color: "#5a2e2e", fontFamily: "'Outfit', sans-serif" }}>
            27 · NOV · 2026
          </p>
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, #be185d, transparent)" }} />
        </div>

        <p className="mt-10 max-w-md" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontStyle: "italic", color: "#8a4a48", lineHeight: 1.5 }}>
          “De toda a gente do mundo, escolhemos nós dois.
          <br />De todos os dias, escolhemos este.
          <br />Que tal celebrar com a gente?”
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <button className="px-8 py-3 transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group"
            style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em" }}
            onClick={() => window.dispatchEvent(new CustomEvent("goto", { detail: "confirmacao" }))}>
            <span className="relative z-10">CONFIRMAR PRESENÇA</span>
            <span className="absolute inset-0 transition-transform duration-500 translate-y-full group-hover:translate-y-0" style={{ background: "#be185d" }} />
          </button>
          <button className="px-8 py-3 transition-all duration-300 hover:translate-y-[-2px]"
            style={{ background: "transparent", border: "1px solid #be185d", color: "#be185d", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em" }}
            onClick={() => window.dispatchEvent(new CustomEvent("goto", { detail: "presentes" }))}>
            LISTA DE PRESENTES
          </button>
        </div>
      </div>

      <div className="relative md:p-8 flex items-center justify-center" style={{ background: "#f8d0c8" }}>
        <div className="w-full max-w-md relative">
          <div className="absolute -top-4 -left-4 w-full h-full border" style={{ borderColor: "#be185d", opacity: 0.4 }} />
          <PhotoPlaceholder label="Foto dos noivos · em breve" icon="couple" ratio="4/5" />
        </div>
        <FloralCorner className="absolute" style={{ width: 160, bottom: 0, right: 0, transform: "rotate(180deg)" }} />
      </div>
    </div>
    <CountdownBar />
  </div>
);

const CountdownBar = () => {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date("2026-11-27T19:00:00-03:00").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  const Cell = ({ n, l }) => (
    <div className="text-center">
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 4vw, 2.5rem)", color: "#fce4e0", fontWeight: 300, lineHeight: 1 }}>
        {String(n).padStart(2, "0")}
      </p>
      <p className="text-xs mt-1" style={{ color: "#f8d0c8", opacity: 0.85, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.3em" }}>{l}</p>
    </div>
  );
  return (
    <div className="py-8 px-6 relative overflow-hidden" style={{ background: "linear-gradient(90deg, #5a2e2e 0%, #8a2e4a 50%, #5a2e2e 100%)" }}>
      <p className="text-center text-xs mb-6 tracking-[0.4em] relative z-10" style={{ color: "#f8d0c8", fontFamily: "'Outfit', sans-serif" }}>
        ✦ FALTAM ✦
      </p>
      <div className="flex justify-center gap-6 md:gap-16 relative z-10">
        <Cell n={time.d} l="DIAS" />
        <Cell n={time.h} l="HORAS" />
        <Cell n={time.m} l="MIN" />
        <Cell n={time.s} l="SEG" />
      </div>
    </div>
  );
};

// ============== EVENT PAGE ==============
const EventPage = ({ title, sub, data, icon }) => (
  <div className="min-h-screen px-6 md:px-16 py-16 relative" style={{ background: "#fce4e0" }}>
    <FloralCorner className="absolute" style={{ width: 200, top: 0, right: 0 }} />
    <FloralCorner className="absolute" style={{ width: 180, bottom: 0, left: 0, transform: "rotate(180deg)" }} />

    <div className="max-w-5xl mx-auto relative">
      <div className="text-center mb-14">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-6" style={{ background: "#be185d" }} />
          <p className="text-xs tracking-[0.4em]" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>{sub}</p>
          <div className="h-px w-6" style={{ background: "#be185d" }} />
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#5a2e2e", fontWeight: 300 }}>
          {title}
        </h2>
        <Divider wide />
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border" style={{ borderColor: "#be185d", opacity: 0.4 }} />
          <PhotoPlaceholder label={`Foto ${sub.toLowerCase()} · em breve`} icon={icon} ratio="4/5" />
        </div>

        {/* CONTAINER ELEGANTE */}
        <div className="relative">
          <div
            className="relative p-10 md:p-12"
            style={{
              background: "#ffffff",
              border: "1px solid #efb5ab",
              boxShadow: "0 1px 0 #c89968, 0 30px 60px -30px rgba(190, 24, 93, 0.25)",
            }}
          >
            {/* Cantos decorativos com fúcsia */}
            <div className="absolute top-2 left-2 w-6 h-6" style={{ borderTop: "1px solid #c89968", borderLeft: "1px solid #c89968" }} />
            <div className="absolute top-2 right-2 w-6 h-6" style={{ borderTop: "1px solid #c89968", borderRight: "1px solid #c89968" }} />
            <div className="absolute bottom-2 left-2 w-6 h-6" style={{ borderBottom: "1px solid #c89968", borderLeft: "1px solid #c89968" }} />
            <div className="absolute bottom-2 right-2 w-6 h-6" style={{ borderBottom: "1px solid #c89968", borderRight: "1px solid #c89968" }} />

            {/* Pequeno selo fúcsia no topo do container */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1" style={{ background: "#fce4e0" }}>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M7 0 L8.4 5.6 L14 7 L8.4 8.4 L7 14 L5.6 8.4 L0 7 L5.6 5.6 Z" fill="#be185d" opacity="0.9" />
              </svg>
            </div>

            <div className="text-center mb-8">
              <p className="text-[0.65rem] tracking-[0.5em]" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>
                NOSSO ENCONTRO
              </p>
              <Divider />
            </div>

            <div className="text-center mb-6">
              <p className="text-[0.7rem] tracking-[0.35em] mb-2" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif" }}>
                LOCAL
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "#5a2e2e", fontWeight: 400, lineHeight: 1.2 }}>
                {data.local}
              </p>
            </div>

            <div className="h-px my-6" style={{ background: "linear-gradient(90deg, transparent, #efb5ab, transparent)" }} />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <p className="text-[0.7rem] tracking-[0.35em] mb-2" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif" }}>
                  DATA
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#5a2e2e", lineHeight: 1.1 }}>
                  27 nov
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#8a4a48" }}>
                  sexta · 2026
                </p>
              </div>
              <div className="text-center" style={{ borderLeft: "1px solid #efb5ab" }}>
                <p className="text-[0.7rem] tracking-[0.35em] mb-2" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif" }}>
                  HORÁRIO
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#5a2e2e", lineHeight: 1.1 }}>
                  {data.horario}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#8a4a48" }}>
                  pontualmente
                </p>
              </div>
            </div>

            <div className="h-px my-6" style={{ background: "linear-gradient(90deg, transparent, #efb5ab, transparent)" }} />

            <div className="text-center mb-8">
              <p className="text-[0.7rem] tracking-[0.35em] mb-2" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif" }}>
                ENDEREÇO
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#5a2e2e", lineHeight: 1.4 }}>
                {data.endereco}
              </p>
              <p className="mt-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: "#8a4a48" }}>
                {data.bairro}
              </p>
              <p className="mt-2 text-xs tracking-[0.25em]" style={{ color: "#c89968", fontFamily: "'Outfit', sans-serif" }}>
                CEP {data.cep}
              </p>
            </div>

            <a href={data.mapsUrl} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 px-7 py-3 transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group"
              style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em" }}>
              <span className="absolute inset-0 transition-transform duration-500 translate-y-full group-hover:translate-y-0" style={{ background: "#be185d" }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <path d="M12 22s-7-7.58-7-12a7 7 0 0114 0c0 4.42-7 12-7 12z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="relative z-10">VER NO GOOGLE MAPS</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============== GIFTS ==============
const GiftsPage = ({ gifts, onGift }) => {
  const available = gifts.filter((g) => !g.reserved);
  return (
    <div className="min-h-screen px-6 md:px-16 py-16 relative" style={{ background: "#fce4e0" }}>
      <FloralCorner className="absolute" style={{ width: 180, top: 0, left: 0, transform: "rotate(90deg)" }} />
      <FloralCorner className="absolute" style={{ width: 180, bottom: 0, right: 0, transform: "rotate(270deg)" }} />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-6" style={{ background: "#be185d" }} />
            <p className="text-xs tracking-[0.4em]" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>COM CARINHO</p>
            <div className="h-px w-6" style={{ background: "#be185d" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#5a2e2e", fontWeight: 300 }}>
            Lista de Presentes
          </h2>
          <Divider wide />
          <p className="mt-6 max-w-xl mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.15rem", color: "#8a4a48" }}>
            Sua presença já é o nosso maior presente.<br />
            Mas se quiser deixar um carinho extra, escolha o que combina com você.
          </p>
        </div>

        {available.length === 0 ? (
          <p className="text-center" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#8a4a48", fontStyle: "italic" }}>
            Todos os presentes já foram escolhidos · obrigado!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {available.map((g) => (
              <div key={g.id} className="group bg-white relative overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl"
                style={{ border: "1px solid #efb5ab", boxShadow: "0 1px 0 #c89968" }}>
                {/* Pequeno detalhe fúcsia no canto do card */}
                <div className="absolute top-0 right-0 w-12 h-12 z-10 pointer-events-none" style={{ background: "linear-gradient(225deg, #be185d40 0%, transparent 70%)" }} />
                <GiftArt icon={g.icon} />
                <div className="p-6 text-center">
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#5a2e2e", fontWeight: 400, minHeight: "3.2rem" }}>
                    {g.name}
                  </h3>
                  <p className="mt-2 mb-5" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", color: "#be185d", letterSpacing: "0.05em", fontWeight: 500 }}>
                    R$ {g.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <button onClick={() => onGift(g)} className="w-full py-3 transition-all duration-300 relative overflow-hidden group/btn"
                    style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em" }}>
                    <span className="absolute inset-0 transition-transform duration-500 translate-y-full group-hover/btn:translate-y-0" style={{ background: "#be185d" }} />
                    <span className="relative z-10">PRESENTEAR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============== GIFT MODAL ==============
const FormInput = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-xs tracking-[0.3em] mb-2" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>{label.toUpperCase()}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full py-2 px-0 bg-transparent border-b focus:outline-none focus:border-[#be185d] transition-colors"
      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#5a2e2e", borderColor: "#8a4a48" }} />
  </div>
);

const GiftModal = ({ gift, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState(null);

  const next = () => {
    if (!name.trim() || !email.trim() || !email.includes("@")) { alert("Preencha nome e email válidos."); return; }
    setStep(2);
  };
  const pickMethod = (m) => { setMethod(m); setStep(m === "pix" ? 3 : 4); };
  const finalize = async () => {
    await onConfirm({ giftId: gift.id, name, email, method, at: new Date().toISOString() });
    setStep(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-md w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()} style={{ background: "#fce4e0" }}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center" style={{ color: "#5a2e2e" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
        <div className="p-8">
          <div className="text-center mb-6">
            <p className="text-xs tracking-[0.4em]" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>VOCÊ ESCOLHEU</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "#5a2e2e", marginTop: 8 }}>{gift.name}</h3>
            <p className="mt-2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", color: "#be185d", fontWeight: 500 }}>
              R$ {gift.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, #efb5ab, transparent)" }} />

          {step === 1 && (
            <div className="space-y-5">
              <p className="text-center" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48", fontSize: "1.05rem" }}>
                Antes de tudo, queremos saber quem mandou esse mimo.
              </p>
              <FormInput label="Seu nome" value={name} onChange={setName} placeholder="Como você gostaria de ser lembrado" />
              <FormInput label="Seu email" value={email} onChange={setEmail} placeholder="seu@email.com" type="email" />
              <button onClick={next} className="w-full py-3 mt-4 transition-all hover:opacity-90"
                style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.3em" }}>
                CONTINUAR
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-center mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48", fontSize: "1.05rem" }}>
                Como você prefere pagar?
              </p>
              <button onClick={() => pickMethod("pix")} className="w-full py-4 hover:translate-y-[-2px] transition-all text-left px-5 flex items-center justify-between"
                style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", letterSpacing: "0.15em" }}>
                <span>PIX</span><span style={{ opacity: 0.7, fontSize: "0.75rem" }}>chave dos noivos</span>
              </button>
              <button onClick={() => pickMethod("card")} className="w-full py-4 hover:translate-y-[-2px] transition-all text-left px-5 flex items-center justify-between"
                style={{ background: "transparent", border: "1px solid #be185d", color: "#be185d", fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", letterSpacing: "0.15em" }}>
                <span>CRÉDITO OU DÉBITO</span><span style={{ opacity: 0.7, fontSize: "0.75rem" }}>via Mercado Pago</span>
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48", fontSize: "1.05rem" }}>
                Use a chave PIX abaixo para fazer a transferência:
              </p>
              <div className="p-5 border-2 border-dashed" style={{ borderColor: "#be185d", background: "#fff" }}>
                <p className="text-xs tracking-[0.3em] mb-2" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>CHAVE PIX · BANCO INTER</p>
                <p className="break-all" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", color: "#5a2e2e", fontWeight: 500 }}>
                  {WEDDING.pixKey}
                </p>
                <button onClick={() => { navigator.clipboard?.writeText(WEDDING.pixKey); alert("Chave copiada!"); }}
                  className="mt-3 text-xs tracking-[0.3em] hover:underline" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif" }}>
                  COPIAR CHAVE
                </button>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48", fontSize: "0.95rem" }}>
                Já fez a transferência? Confirme abaixo para finalizar.
              </p>
              <button onClick={finalize} className="w-full py-3"
                style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.3em" }}>
                JÁ FIZ O PIX
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48", fontSize: "1.05rem" }}>
                Você será redirecionado para o Mercado Pago.
              </p>
              <div className="p-5 border" style={{ borderColor: "#efb5ab", background: "#fff" }}>
                <p className="text-xs tracking-[0.3em] mb-1" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>VALOR</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#5a2e2e" }}>
                  R$ {gift.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <p className="text-xs" style={{ fontFamily: "'Outfit', sans-serif", color: "#8a4a48", fontStyle: "italic" }}>
                (Protótipo — no site real abrirá o checkout do Mercado Pago)
              </p>
              <button onClick={finalize} className="w-full py-3"
                style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.3em" }}>
                JÁ FIZ O PAGAMENTO
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 text-center py-6">
              <div className="flex justify-center mb-2"><Monogram size={60} /></div>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "#5a2e2e", fontStyle: "italic", fontWeight: 400 }}>
                Obrigado, {name.split(" ")[0]}!
              </h4>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#8a4a48", fontSize: "1.1rem", lineHeight: 1.5 }}>
                Recebemos seu carinho com muito amor.<br />Nos vemos no dia 27.
              </p>
              <button onClick={onClose} className="px-8 py-3"
                style={{ background: "transparent", border: "1px solid #be185d", color: "#be185d", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.3em" }}>
                FECHAR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============== CONFIRMACAO ==============
const ConfirmacaoPage = ({ guests, onConfirm }) => {
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const matches = search.trim().length >= 2
    ? guests.filter((g) => !g.confirmed).filter((g) => norm(g.name).includes(norm(search.trim()))).slice(0, 8)
    : [];

  const togglePicked = (g) => {
    setPicked((p) => p.some((x) => x.id === g.id) ? p.filter((x) => x.id !== g.id) : [...p, g]);
    setSearch("");
  };

  const submit = async () => {
    if (picked.length === 0) return alert("Selecione ao menos um convidado.");
    if (!name.trim() || !email.includes("@")) return alert("Preencha seu nome e email.");
    await onConfirm({ guestIds: picked.map((p) => p.id), confirmedBy: name, email, at: new Date().toISOString() });
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#fce4e0" }}>
        <div className="text-center max-w-md">
          <Monogram size={100} />
          <h2 className="mt-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#5a2e2e", fontStyle: "italic", fontWeight: 300 }}>
            Que alegria!
          </h2>
          <p className="mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#8a4a48", lineHeight: 1.6 }}>
            Presença confirmada para:
          </p>
          <ul className="mt-4 space-y-1">
            {picked.map((p) => (
              <li key={p.id} style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.3rem", color: "#5a2e2e" }}>
                {p.name}
              </li>
            ))}
          </ul>
          <p className="mt-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#be185d", fontSize: "1.05rem" }}>
            Mal podemos esperar pra dançar com vocês.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-16 py-16" style={{ background: "#fce4e0" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-6" style={{ background: "#be185d" }} />
            <p className="text-xs tracking-[0.4em]" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>R.S.V.P.</p>
            <div className="h-px w-6" style={{ background: "#be185d" }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#5a2e2e", fontWeight: 300 }}>
            Confirmar Presença
          </h2>
          <Divider wide />
          <p className="mt-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.15rem", color: "#8a4a48" }}>
            Digite seu nome (ou de quem você está confirmando).<br />Pode confirmar mais de uma pessoa.
          </p>
        </div>

        <div className="relative mb-2">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Comece a digitar o nome..."
            className="w-full py-3 px-5 bg-white focus:outline-none focus:border-[#be185d] border transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#5a2e2e", borderColor: "#efb5ab" }} />
          {matches.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-t-0 shadow-lg z-10"
              style={{ borderColor: "#efb5ab", maxHeight: "300px", overflowY: "auto" }}>
              {matches.map((g) => (
                <button key={g.id} onClick={() => togglePicked(g)}
                  className="w-full text-left px-5 py-3 hover:bg-[#fce4e0] border-b last:border-b-0 transition-colors"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#5a2e2e", borderColor: "#efb5ab80" }}>
                  {g.name}
                </button>
              ))}
            </div>
          )}
          {search.trim().length >= 2 && matches.length === 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-t-0 px-5 py-4" style={{ borderColor: "#efb5ab" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48" }}>
                Nenhum nome encontrado. Tente outra grafia.
              </p>
            </div>
          )}
        </div>

        {picked.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-[0.3em] mb-3" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>CONFIRMANDO PRESENÇA DE</p>
            <div className="flex flex-wrap gap-2">
              {picked.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-2 pl-4 pr-2 py-2"
                  style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", borderLeft: "3px solid #be185d" }}>
                  {p.name}
                  <button onClick={() => togglePicked(p)} className="w-5 h-5 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" /></svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {picked.length > 0 && (
          <div className="mt-10 space-y-5">
            <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #efb5ab, transparent)" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48" }}>
              Agora só falta saber quem está fazendo a confirmação:
            </p>
            <FormInput label="Seu nome" value={name} onChange={setName} placeholder="Seu nome completo" />
            <FormInput label="Seu email" value={email} onChange={setEmail} placeholder="seu@email.com" type="email" />
            <button onClick={submit} className="w-full py-4 hover:translate-y-[-2px] transition-all mt-4 relative overflow-hidden group"
              style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.3em" }}>
              <span className="absolute inset-0 transition-transform duration-500 translate-y-full group-hover:translate-y-0" style={{ background: "#be185d" }} />
              <span className="relative z-10">CONFIRMAR PRESENÇA</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============== ADMIN ==============
const Stat = ({ label, value, accent }) => (
  <div className="bg-white p-5 border relative overflow-hidden" style={{ borderColor: "#efb5ab" }}>
    {accent && <div className="absolute top-0 left-0 w-1 h-full" style={{ background: "#be185d" }} />}
    <p className="text-xs tracking-[0.25em] mb-1" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>{label.toUpperCase()}</p>
    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "#5a2e2e", fontWeight: 400 }}>{value}</p>
  </div>
);

const AdminPanel = ({ gifts, setGifts, guests, setGuests, confirmations, giftClaims, onLogout }) => {
  const [tab, setTab] = useState("gifts");
  const [newGift, setNewGift] = useState({ name: "", price: "", icon: "panela" });
  const [newGuest, setNewGuest] = useState("");

  const addGift = () => {
    if (!newGift.name.trim() || !newGift.price) return;
    setGifts([...gifts, { id: `g${Date.now()}`, name: newGift.name, price: parseFloat(newGift.price), icon: newGift.icon, reserved: false }]);
    setNewGift({ name: "", price: "", icon: "panela" });
  };
  const removeGift = (id) => { if (confirm("Remover este presente?")) setGifts(gifts.filter((g) => g.id !== id)); };
  const toggleReserved = (id) => setGifts(gifts.map((g) => (g.id === id ? { ...g, reserved: !g.reserved } : g)));
  const addGuest = () => { if (!newGuest.trim()) return; setGuests([...guests, { id: `gu${Date.now()}`, name: newGuest.trim() }]); setNewGuest(""); };
  const removeGuest = (id) => { if (confirm("Remover este convidado?")) setGuests(guests.filter((g) => g.id !== id)); };

  const totalArrec = giftClaims.reduce((acc, c) => acc + (gifts.find((x) => x.id === c.giftId)?.price || 0), 0);

  return (
    <div className="min-h-screen px-6 md:px-12 py-12" style={{ background: "#fce4e0" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.4em]" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>ÁREA RESTRITA</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", color: "#5a2e2e", fontWeight: 300 }}>
              Painel dos Noivos
            </h2>
          </div>
          <button onClick={onLogout} className="text-xs tracking-[0.3em] px-4 py-2"
            style={{ border: "1px solid #be185d", color: "#be185d", fontFamily: "'Outfit', sans-serif" }}>SAIR</button>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <Stat label="Presentes na lista" value={gifts.filter((g) => !g.reserved).length} />
          <Stat label="Presentes reservados" value={gifts.filter((g) => g.reserved).length} />
          <Stat label="Total arrecadado" value={`R$ ${totalArrec.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent />
          <Stat label="Confirmados" value={`${guests.filter((g) => g.confirmed).length}/${guests.length}`} accent />
        </div>

        <div className="flex gap-1 mb-6 border-b flex-wrap" style={{ borderColor: "#efb5ab" }}>
          {[
            { id: "gifts", label: "Lista de Presentes" },
            { id: "claims", label: "Quem Presenteou" },
            { id: "guests", label: "Lista de Convidados" },
            { id: "confirms", label: "Confirmações" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="px-5 py-3 transition-all"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em",
                color: tab === t.id ? "#5a2e2e" : "#8a4a48",
                borderBottom: tab === t.id ? "2px solid #be185d" : "2px solid transparent", marginBottom: "-1px",
                fontWeight: tab === t.id ? 500 : 400 }}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "gifts" && (
          <div>
            <div className="bg-white p-5 mb-6 border" style={{ borderColor: "#efb5ab", borderLeft: "3px solid #be185d" }}>
              <p className="text-xs tracking-[0.3em] mb-3" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>NOVO PRESENTE</p>
              <div className="grid sm:grid-cols-4 gap-3">
                <input type="text" placeholder="Nome do presente" value={newGift.name}
                  onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                  className="px-3 py-2 border focus:outline-none focus:border-[#be185d] sm:col-span-2"
                  style={{ borderColor: "#efb5ab", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                <input type="number" placeholder="Valor (R$)" value={newGift.price}
                  onChange={(e) => setNewGift({ ...newGift, price: e.target.value })}
                  className="px-3 py-2 border focus:outline-none focus:border-[#be185d]"
                  style={{ borderColor: "#efb5ab", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                <select value={newGift.icon} onChange={(e) => setNewGift({ ...newGift, icon: e.target.value })}
                  className="px-3 py-2 border focus:outline-none"
                  style={{ borderColor: "#efb5ab", fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem" }}>
                  {["panela","taca","cafe","liquid","cama","toalha","airfryer","faca","prato","aviao","hotel","robo"].map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
              <button onClick={addGift} className="mt-3 px-6 py-2"
                style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em" }}>
                ADICIONAR
              </button>
            </div>
            <div className="space-y-2">
              {gifts.map((g) => (
                <div key={g.id} className="bg-white p-4 flex items-center gap-4 border" style={{ borderColor: "#efb5ab", opacity: g.reserved ? 0.6 : 1 }}>
                  <div className="w-14 h-14 flex-shrink-0 overflow-hidden"><GiftArt icon={g.icon} /></div>
                  <div className="flex-1">
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#5a2e2e" }}>
                      {g.name}
                      {g.reserved && <span className="ml-2 text-xs px-2 py-1" style={{ background: "#be185d", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.15em" }}>RESERVADO</span>}
                    </p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", color: "#be185d", fontWeight: 500 }}>
                      R$ {g.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button onClick={() => toggleReserved(g.id)} className="px-3 py-2 text-xs"
                    style={{ border: "1px solid #be185d", color: "#be185d", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.15em" }}>
                    {g.reserved ? "REATIVAR" : "RESERVAR"}
                  </button>
                  <button onClick={() => removeGift(g.id)} className="w-8 h-8 flex items-center justify-center" style={{ color: "#8a4a48" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "claims" && (
          <div className="space-y-2">
            {giftClaims.length === 0 ? (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48" }}>Nenhum presente recebido ainda.</p>
            ) : giftClaims.map((c, i) => {
              const g = gifts.find((x) => x.id === c.giftId);
              return (
                <div key={i} className="bg-white p-4 flex items-center gap-4 border" style={{ borderColor: "#efb5ab", borderLeft: "3px solid #be185d" }}>
                  <div className="flex-1">
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#5a2e2e" }}>{g?.name || "—"}</p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "#8a4a48" }}>
                      Por <strong>{c.name}</strong> · {c.email}
                    </p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#be185d", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>
                      {c.method} · {new Date(c.at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#be185d" }}>
                    R$ {g?.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {tab === "guests" && (
          <div>
            <div className="bg-white p-5 mb-6 border flex gap-3" style={{ borderColor: "#efb5ab", borderLeft: "3px solid #be185d" }}>
              <input type="text" placeholder="Nome completo do convidado" value={newGuest}
                onChange={(e) => setNewGuest(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addGuest()}
                className="flex-1 px-3 py-2 border focus:outline-none focus:border-[#be185d]"
                style={{ borderColor: "#efb5ab", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
              <button onClick={addGuest} className="px-6 py-2"
                style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em" }}>
                ADICIONAR
              </button>
            </div>
            <div className="space-y-1">
              {guests.map((g) => (
                <div key={g.id} className="bg-white px-4 py-3 flex items-center gap-3 border" style={{ borderColor: "#efb5ab" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: g.confirmed ? "#be185d" : "#efb5ab" }} />
                  <p className="flex-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#5a2e2e" }}>
                    {g.name}
                    {g.confirmed && (
                      <span className="ml-2 text-xs" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.15em" }}>
                        · CONFIRMADO POR {g.confirmedBy?.toUpperCase()}
                      </span>
                    )}
                  </p>
                  <button onClick={() => removeGuest(g.id)} className="w-8 h-8 flex items-center justify-center" style={{ color: "#8a4a48" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "confirms" && (
          <div className="space-y-2">
            {confirmations.length === 0 ? (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a4a48" }}>Nenhuma confirmação ainda.</p>
            ) : confirmations.map((c, i) => (
              <div key={i} className="bg-white p-4 border" style={{ borderColor: "#efb5ab", borderLeft: "3px solid #be185d" }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "#be185d", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Confirmado por {c.confirmedBy} · {c.email} · {new Date(c.at).toLocaleString("pt-BR")}
                </p>
                <ul className="mt-2">
                  {c.guestIds.map((id) => {
                    const g = guests.find((x) => x.id === id);
                    return <li key={id} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#5a2e2e" }}>· {g?.name || "(removido)"}</li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminLogin = ({ onLogin, onCancel }) => {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => { if (pw === ADMIN_PASSWORD) onLogin(); else setErr(true); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="p-10 max-w-sm w-full text-center" style={{ background: "#fce4e0" }}>
        <Monogram size={60} />
        <h3 className="mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "#5a2e2e", fontStyle: "italic" }}>
          Área dos noivos
        </h3>
        <p className="mt-2 text-xs tracking-[0.3em]" style={{ color: "#be185d", fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>DIGITE A SENHA</p>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full mt-4 py-2 px-3 border bg-white focus:outline-none text-center"
          style={{ borderColor: err ? "#a85c5c" : "#be185d", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }} />
        {err && <p className="mt-2 text-sm" style={{ color: "#a85c5c", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>senha incorreta</p>}
        <p className="mt-2 text-xs" style={{ color: "#8a4a48", fontFamily: "'Outfit', sans-serif", fontStyle: "italic" }}>(demo: danieldanielle2026)</p>
        <div className="flex gap-2 mt-6">
          <button onClick={onCancel} className="flex-1 py-2"
            style={{ border: "1px solid #8a4a48", color: "#8a4a48", fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em" }}>CANCELAR</button>
          <button onClick={submit} className="flex-1 py-2"
            style={{ background: "#8a4a48", color: "#fce4e0", fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em" }}>ENTRAR</button>
        </div>
      </div>
    </div>
  );
};

// ============== MAIN ==============
export default function App() {
  const [page, setPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [gifts, setGifts] = useState(DEFAULT_GIFTS.map((g) => ({ ...g, reserved: false })));
  const [guests, setGuests] = useState(DEFAULT_GUESTS.map((g) => ({ ...g, confirmed: false, confirmedBy: null })));
  const [giftClaims, setGiftClaims] = useState([]);
  const [confirmations, setConfirmations] = useState([]);
  const [activeGift, setActiveGift] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const g = await loadState("dd_gifts_v3", null);
      const gu = await loadState("dd_guests_v3", null);
      const cl = await loadState("dd_claims_v3", []);
      const cf = await loadState("dd_confirms_v3", []);
      if (g) setGifts(g);
      if (gu) setGuests(gu);
      setGiftClaims(cl);
      setConfirmations(cf);
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (loaded) saveState("dd_gifts_v3", gifts); }, [gifts, loaded]);
  useEffect(() => { if (loaded) saveState("dd_guests_v3", guests); }, [guests, loaded]);
  useEffect(() => { if (loaded) saveState("dd_claims_v3", giftClaims); }, [giftClaims, loaded]);
  useEffect(() => { if (loaded) saveState("dd_confirms_v3", confirmations); }, [confirmations, loaded]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);

  useEffect(() => {
    const handler = (e) => setPage(e.detail);
    window.addEventListener("goto", handler);
    return () => window.removeEventListener("goto", handler);
  }, []);

  const handleGiftConfirm = async (claim) => {
    setGifts((prev) => prev.map((g) => (g.id === claim.giftId ? { ...g, reserved: true } : g)));
    setGiftClaims((prev) => [...prev, claim]);
  };
  const handlePresenceConfirm = async (data) => {
    setGuests((prev) => prev.map((g) => data.guestIds.includes(g.id) ? { ...g, confirmed: true, confirmedBy: data.confirmedBy } : g));
    setConfirmations((prev) => [...prev, data]);
  };

  if (admin) {
    return (
      <div style={{ background: "#fce4e0", minHeight: "100vh" }}>
        <AdminPanel gifts={gifts} setGifts={setGifts} guests={guests} setGuests={setGuests}
          confirmations={confirmations} giftClaims={giftClaims} onLogout={() => setAdmin(false)} />
      </div>
    );
  }

  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#fce4e0" }}>
      <Sidebar current={page} setPage={setPage} onAdminClick={() => setAdminLogin(true)} isMobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 overflow-x-hidden">
        {page === "home" && <HomePage />}
        {page === "ceremonia" && <EventPage title="Cerimônia" sub="ONDE TUDO COMEÇA" data={WEDDING.ceremonia} icon="church" />}
        {page === "recepcao" && <EventPage title="Recepção" sub="ONDE A FESTA ACONTECE" data={WEDDING.recepcao} icon="venue" />}
        {page === "presentes" && <GiftsPage gifts={gifts} onGift={setActiveGift} />}
        {page === "confirmacao" && <ConfirmacaoPage guests={guests} onConfirm={handlePresenceConfirm} />}
      </main>
      {activeGift && <GiftModal gift={activeGift} onClose={() => setActiveGift(null)} onConfirm={handleGiftConfirm} />}
      {adminLogin && <AdminLogin onLogin={() => { setAdmin(true); setAdminLogin(false); }} onCancel={() => setAdminLogin(false)} />}
    </div>
  );
}
