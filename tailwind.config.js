/** @type {import('tailwindcss').Config} */
module.exports = {
  // relative: caminhos contados a partir deste arquivo, nao da pasta onde o comando rodou.
  content: { relative: true, files: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"] },
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", '"Cormorant Garamond"', "serif"],
        sans: ["var(--font-sans)", '"Outfit"', "sans-serif"],
      },
      colors: {
        // Base creme, tirada do papel do convite
        blush: "#f5f0ea",      // creme (fundo principal)
        petal: "#efe6dc",      // creme quente (faixas e seções)
        carta: "#fffcf7",      // branco quente (cartões)
        dust: "#e3d7c8",       // bege (bordas)
        rose: "#d4b1b5",       // rosa acinzentado (linha do quadro)
        // Texto / vinho
        wine: "#8a4a48",       // vinho suave
        deep: "#5a2e2e",       // vinho profundo
        // Acentos pink / fúcsia
        pink: "#ec4899",       // pink vivo
        fuchsia: "#be185d",    // fúcsia profundo
        // Dourado
        gold: "#c89968",       // champagne quente
      },
    },
  },
  plugins: [],
};
