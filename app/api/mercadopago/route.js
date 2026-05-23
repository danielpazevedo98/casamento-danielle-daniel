import { NextResponse } from "next/server";
import { createGiftPreference } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const { giftId, name, email } = await request.json();
  const supabase = supabaseAdmin();
  
  const { data: gift } = await supabase.from("gifts").select("*").eq("id", giftId).single();
  if (!gift) return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pref = await createGiftPreference({ gift, buyer: { name, email }, siteUrl });
  
  return NextResponse.json({ init_point: pref.init_point });
}
