import { ImageResponse } from "next/og";

// Imagem da previa do link (WhatsApp, Instagram...). Quando a foto dos noivos
// chegar, da para trocar este desenho por ela.
export const runtime = "edge";
export const alt = "Casamento Danielle & Daniel · 27.11.2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagem() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fce4e0 0%, #f8d0c8 60%, #efb5ab 100%)",
          color: "#5a2e2e",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 12, color: "#be185d" }}>ESTAMOS NOS CASANDO</div>
        <div style={{ display: "flex", fontSize: 120, marginTop: 30, fontWeight: 300 }}>Danielle & Daniel</div>
        <div style={{ display: "flex", width: 160, height: 2, background: "#c89968", marginTop: 34 }} />
        <div style={{ display: "flex", fontSize: 40, letterSpacing: 10, marginTop: 34, color: "#8a4a48" }}>27 · 11 · 2026</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 14, color: "#8a4a48" }}>Rio de Janeiro</div>
      </div>
    ),
    size
  );
}
