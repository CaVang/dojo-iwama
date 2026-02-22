import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch dojo profile
  const { data: dojo, error: dojoError } = await supabase
    .from("dojos")
    .select("*")
    .eq("id", id)
    .single();

  if (dojoError) {
    return NextResponse.json({ error: "Dojo not found" }, { status: 404 });
  }

  // Fetch upcoming events for this dojo
  const { data: events } = await supabase
    .from("dojo_events")
    .select("*")
    .eq("dojo_id", id)
    .gte("event_date", new Date().toISOString().split("T")[0])
    .order("event_date", { ascending: true })
    .limit(4);

  // Fetch latest published blogs for this dojo
  const { data: blogs } = await supabase
    .from("dojo_blogs")
    .select("*")
    .eq("dojo_id", id)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch classes with schedules for this dojo
  const { data: classes } = await supabase
    .from("dojo_classes")
    .select("*, class_schedules(*)")
    .eq("dojo_id", id)
    .order("name", { ascending: true });

  return NextResponse.json({
    dojo,
    events: events || [],
    blogs: blogs || [],
    classes: classes || [],
  });
}
