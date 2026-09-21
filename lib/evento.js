// Dados do casamento usados em varias paginas. Mudou algo? Muda so aqui.
export const EVENTO = {
  inicio: "2026-11-27T19:00:00-03:00",
  dataCurta: "27 · NOV · 2026",
  dataLonga: "27 de novembro de 2026",

  // Prazo para confirmar presenca. Enquanto for null, o site nao mostra prazo.
  // Exemplo: { iso: "2026-11-01", texto: "1º de novembro" }
  prazoRsvp: null,

  cerimonia: {
    local: "Igreja Sagrado Coração de Jesus",
    horario: "19h00",
    endereco: "Rua Carolina Santos, 143",
    bairro: "Lins de Vasconcelos · Rio de Janeiro",
    cep: "20720-310",
    mapa: "https://www.google.com/maps/search/?api=1&query=Igreja+Sagrado+Cora%C3%A7%C3%A3o+de+Jesus+Rua+Carolina+Santos+143+Rio+de+Janeiro",
    foto: "/fotos/igreja.png",
  },

  recepcao: {
    local: "Casa de Festas Monet",
    horario: "21h30",
    endereco: "Rua São Francisco Xavier, 957",
    bairro: "Maracanã · Rio de Janeiro",
    cep: "20550-017",
    mapa: "https://www.google.com/maps/search/?api=1&query=Casa+de+Festas+Monet+Rua+S%C3%A3o+Francisco+Xavier+957+Maracan%C3%A3+Rio+de+Janeiro",
    foto: "/fotos/casa-de-festas-entrada.webp",
  },

  // Musica de fundo. Enquanto for null, o botao nem aparece no site.
  // Para ligar: por o arquivo em public/musica/ e trocar por
  // { arquivo: "/musica/nome-do-arquivo.mp3", titulo: "Nome da musica" }
  musica: { arquivo: "/musica/im-yours.m4a", titulo: "I'm Yours · Jason Mraz" },

  traje: {
    titulo: "Esporte fino",
    recado: "Um pedido com carinho: o branco e o bege ficam reservados para a noiva.",
  },

  // Fotos do casal na pagina inicial: passam de 3 em 3 segundos (e no clique).
  fotosNoivos: [
    "/fotos/casal-1.webp",
    "/fotos/casal-2.webp",
    "/fotos/casal-3.webp",
    "/fotos/casal-4.webp",
    "/fotos/casal-5.webp",
    "/fotos/casal-6.webp",
    "/fotos/casal-7.webp",
    "/fotos/casal-8.webp",
  ],
};

// Faixas de preco do filtro de presentes ("min-max"; sem max = sem teto).
// Os precos sao multiplos de 10, entao "100-150" pega de R$ 100 a R$ 140.
export const FAIXAS = [
  ["", "Todas as faixas de preço"],
  ["100-150", "R$ 100 a R$ 140"],
  ["150-200", "R$ 150 a R$ 190"],
  ["200-300", "R$ 200 a R$ 290"],
  ["300-500", "R$ 300 a R$ 490"],
  ["500-1000", "R$ 500 a R$ 990"],
  ["1000-", "R$ 1.000 ou mais"],
];

// O limite de baixo entra na faixa e o de cima nao. (Mesma regra do cha.)
export function naFaixa(preco, faixa) {
  if (!faixa) return true;
  const [min, max] = faixa.split("-");
  if (Number(preco) < Number(min)) return false;
  return max === "" ? true : Number(preco) < Number(max);
}

// Categorias dos presentes, na ordem em que aparecem nos filtros.
// As cores formam o degrade da ilustracao padrao de cada presente.
export const CATEGORIAS = [
  { nome: "Lua de mel", cores: ["#f3e6de", "#dcb4ad"] },
  { nome: "Casa nova", cores: ["#f4efe4", "#d9c6ab"] },
  { nome: "Vida a dois", cores: ["#f4e6e6", "#d0a2ab"] },
  { nome: "Só pra rir", cores: ["#f8efdf", "#e0bd93"] },
];
