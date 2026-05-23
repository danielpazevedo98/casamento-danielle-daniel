import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const { id, color } = await request.json();
  const supabase = supabaseAdmin();
  
  const { error } = await supabase
    .from("guests")
    .update({ color })
    .eq("id", id);
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
