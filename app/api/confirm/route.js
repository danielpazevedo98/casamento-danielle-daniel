import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const { guestIds, name, email } = await request.json();
  const supabase = supabaseAdmin();
  
  for (const id of guestIds) {
    await supabase.from("guests").update({
      confirmed: true,
      confirmed_by_name: name,
      confirmed_by_email: email,
      confirmed_at: new Date().toISOString()
    }).eq("id", id);
  }
  
  const { data, error } = await supabase.from("confirmations").insert([{
    confirmed_by_name: name,
    confirmed_by_email: email,
    guest_ids: guestIds,
  }]).select().single();
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
