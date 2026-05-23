import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const { giftId, name, email } = await request.json();
  const supabase = supabaseAdmin();
  
  await supabase.from("gifts").update({ reserved: true }).eq("id", giftId);
  
  const { data, error } = await supabase.from("gift_claims").insert([{
    gift_id: giftId,
    guest_name: name,
    guest_email: email,
    method: "pix",
    status: "confirmed",
  }]).select().single();
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
