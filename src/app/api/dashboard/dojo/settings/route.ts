import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch the current user's dojo settings
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find which dojo this user owns
  const { data: ownership, error: ownerError } = await supabase
    .from("dojo_owners")
    .select("dojo_id")
    .eq("user_id", user.id)
    .single();

  if (ownerError || !ownership) {
    return NextResponse.json({ error: "No dojo ownership found" }, { status: 404 });
  }

  // Fetch dojo data
  const { data: dojo, error: dojoError } = await supabase
    .from("dojos")
    .select("*")
    .eq("id", ownership.dojo_id)
    .single();

  if (dojoError && dojoError.code === "PGRST116") {
    // No dojo row exists yet, return empty with dojo_id so frontend can create
    return NextResponse.json({ dojo: null, dojo_id: ownership.dojo_id });
  }

  if (dojoError) {
    return NextResponse.json({ error: dojoError.message }, { status: 500 });
  }

  return NextResponse.json({ dojo, dojo_id: ownership.dojo_id });
}

// PATCH: Update dojo settings
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { dojo_id, name, chief_instructor, address, lat, lng, phone, email, avatar_url, background_url, description } = body;

  if (!dojo_id || !name) {
    return NextResponse.json({ error: "dojo_id and name are required" }, { status: 400 });
  }

  // Verify ownership
  const { data: ownership } = await supabase
    .from("dojo_owners")
    .select("dojo_id")
    .eq("user_id", user.id)
    .eq("dojo_id", dojo_id)
    .single();

  if (!ownership) {
    return NextResponse.json({ error: "Not authorized for this dojo" }, { status: 403 });
  }

  const updateData = {
    id: dojo_id,
    name,
    chief_instructor: chief_instructor || null,
    address: address || null,
    lat: lat || null,
    lng: lng || null,
    phone: phone || null,
    email: email || null,
    avatar_url: avatar_url || null,
    background_url: background_url || null,
    description: description || null,
    updated_at: new Date().toISOString(),
  };

  // Upsert: insert if not exists, update if exists
  const { data: dojo, error } = await supabase
    .from("dojos")
    .upsert(updateData, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dojo });
}
