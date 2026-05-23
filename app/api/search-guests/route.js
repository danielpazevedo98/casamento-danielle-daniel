import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  
  if (!q || q.length < 2) return NextResponse.json([]);
  
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .ilike("name", `%${q}%`)
    .eq("confirmed", false)
    .limit(10);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
