import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Musica from "@/components/Musica";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-sans", display: "swap" });

const descricao = "27 de novembro de 2026 · Rio de Janeiro. Confirme sua presença e veja nossa lista de presentes.";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://casamento-danielle-daniel.vercel.app"),
  title: "Casamento Danielle & Daniel",
  description: descricao,
  openGraph: {
    title: "Casamento Danielle & Daniel",
    description: descricao,
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport = { themeColor: "#f5f0ea" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <Musica />
      </body>
    </html>
  );
}
