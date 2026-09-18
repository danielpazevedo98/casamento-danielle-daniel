import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Sem isto o Next gerava a resposta uma vez no build e o cron nunca
// chegava a consultar o banco (o Supabase gratis pausa sem uso).
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = supabaseAdmin();
    
    const { data, error } = await supabase
      .from("gifts")
      .select("id")
      .limit(1);
    
    if (error) throw error;
    
    console.log("[keep-alive] Supabase ping OK:", new Date().toISOString());
    return NextResponse.json({ 
      ok: true, 
      timestamp: new Date().toISOString(),
      message: "Supabase ativo e funcionando!"
    });
    
  } catch (err) {
    console.error("[keep-alive] Erro:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
