import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: events, error } = await supabase
      .from("dojo_events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching public events:", error);
      return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
    }

    return NextResponse.json({ events: events || [] });
  } catch (error: any) {
    console.error("Public get events API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
