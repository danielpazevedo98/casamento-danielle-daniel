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
    // Caminho em /public, ex.: "/fotos/igreja.jpg". null mostra o espaco reservado.
    foto: null,
  },

  recepcao: {
    local: "Casa de Festas Monet",
    horario: "21h30",
    endereco: "Rua São Francisco Xavier, 957",
    bairro: "Maracanã · Rio de Janeiro",
    cep: "20550-017",
    mapa: "https://www.google.com/maps/search/?api=1&query=Casa+de+Festas+Monet+Rua+S%C3%A3o+Francisco+Xavier+957+Maracan%C3%A3+Rio+de+Janeiro",
    foto: null,
  },

  // Foto principal da pagina inicial (vertical, 4:5).
  fotoNoivos: null,
};

// Categorias dos presentes, na ordem em que aparecem nos filtros.
// As cores formam o degrade da ilustracao padrao de cada presente.
export const CATEGORIAS = [
  { nome: "Lua de mel", cores: ["#f8d0c8", "#e89aa0"] },
  { nome: "Casa nova", cores: ["#fce4e0", "#efb5ab"] },
  { nome: "Vida a dois", cores: ["#f8d0c8", "#d98aa6"] },
  { nome: "Só pra rir", cores: ["#fdeee0", "#e8b98f"] },
];
