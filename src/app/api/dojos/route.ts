import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch all dojos (public)
export async function GET() {
  const supabase = await createClient();

  const { data: dojos, error } = await supabase
    .from("dojos")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dojos: dojos || [] });
}
