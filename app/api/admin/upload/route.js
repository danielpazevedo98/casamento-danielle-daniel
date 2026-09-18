import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { exigirAdmin } from "@/lib/adminAuth";
import { falha, invalido, ok } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

const TIPOS = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };

// Imagem de um presente (o navegador ja reduz antes de enviar).
export async function POST(request) {
  const negado = exigirAdmin(request);
  if (negado) return negado;

  const arquivo = (await request.formData()).get("arquivo");
  if (!arquivo || typeof arquivo === "string" || !TIPOS[arquivo.type]) return invalido("Envie uma imagem JPG, PNG ou WebP");
  if (arquivo.size > 4 * 1024 * 1024) return invalido("Imagem grande demais (máximo 4 MB)");

  const db = supabaseAdmin();
  const caminho = `${crypto.randomUUID()}.${TIPOS[arquivo.type]}`;
  const { error } = await db.storage
    .from("presentes")
    .upload(caminho, Buffer.from(await arquivo.arrayBuffer()), { contentType: arquivo.type });
  if (error) return falha(error);
  return ok({ url: db.storage.from("presentes").getPublicUrl(caminho).data.publicUrl });
}
