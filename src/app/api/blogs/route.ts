import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const event_id = searchParams.get("event_id");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : null;
    
    let query = supabase
      .from("dojo_blogs")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (event_id) {
       query = query.eq("event_id", event_id);
    }
    
    if (limit) {
       query = query.limit(limit);
    }

    const { data: blogs, error } = await query;

    if (error) {
      console.error("Supabase Error (Public Blogs GET):", error);
      return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }

    return NextResponse.json({ blogs });
  } catch (error: any) {
    console.error("Public Blogs API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
