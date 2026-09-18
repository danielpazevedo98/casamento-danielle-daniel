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
        // Paleta rosa v3
        blush: "#fce4e0",      // rosa balé (fundo principal)
        petal: "#f8d0c8",      // rosa pálido (seções)
        dust: "#efb5ab",       // rosa empoeirado (cartões)
        rose: "#e89aa0",       // rosa antigo (bordas marcadas)
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
