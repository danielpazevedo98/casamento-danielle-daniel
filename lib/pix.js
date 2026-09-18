// Gera o "Pix copia e cola" (BR Code) estatico com valor, no padrao EMV do
// Banco Central. Nao passa por nenhum intermediario: o dinheiro cai direto na
// chave e nao tem taxa. A confirmacao do recebimento e feita no admin.

// Dados do recebedor. As variaveis NEXT_PUBLIC_PIX_* sao as antigas, que ja
// estavam configuradas na Vercel.
export const recebedorPix = () => ({
  chave: process.env.PIX_CHAVE || process.env.NEXT_PUBLIC_PIX_KEY,
  nome: process.env.PIX_NOME || "Daniel Azevedo",
  cidade: process.env.PIX_CIDADE || "Rio de Janeiro",
  banco: process.env.PIX_BANCO || process.env.NEXT_PUBLIC_PIX_BANK || null,
});

const campo = (id, valor) => id + String(valor.length).padStart(2, "0") + valor;

// Nome e cidade vao sem acento e com tamanho maximo, como pede o padrao.
const ascii = (s, max) =>
  (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .slice(0, max);

// CRC16-CCITT (polinomio 0x1021, inicio 0xFFFF), exigido no campo 63.
export function crc16(texto) {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(texto)) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function pixCopiaECola({ chave, nome, cidade, valor, txid, descricao }) {
  const conta =
    campo("00", "br.gov.bcb.pix") +
    campo("01", chave) +
    (descricao ? campo("02", ascii(descricao, 40)) : "");
  const txidLimpo = (txid || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***";

  const payload =
    campo("00", "01") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    campo("54", Number(valor).toFixed(2)) +
    campo("58", "BR") +
    campo("59", ascii(nome, 25).toUpperCase()) +
    campo("60", ascii(cidade, 15).toUpperCase()) +
    campo("62", campo("05", txidLimpo)) +
    "6304";

  return payload + crc16(payload);
}
