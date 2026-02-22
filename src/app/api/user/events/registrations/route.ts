import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // ==========================================
    // DEMO/SIMULATION MODE FOR LOCAL DEVELOPMENT 
    // ==========================================
    if (process.env.NODE_ENV === "development") {
      const { data: authCookie } = await supabase.auth.getSession();
      // Allow simulation even without true auth if we want, but better to enforce user login
      // For this feature, user must be logged in to have an ID.
    }

    if (authError || !user) {
      return NextResponse.json({ registeredEventIds: [] }); // Not logged in, no highlights
    }

    // Fetch user registrations
    const { data: registrations, error } = await supabase
      .from("event_registrations")
      .select("event_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching event registrations:", error);
      return NextResponse.json({ registeredEventIds: [] });
    }

    const registeredEventIds = registrations.map(r => r.event_id);
    return NextResponse.json({ registeredEventIds });
  } catch (error: any) {
    console.error("User events registration API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event_id } = await req.json();

    if (!event_id) {
        return NextResponse.json({ error: "Missing event_id" }, { status: 400 });
    }

    // Verify event exists and is not a JSON static placeholder 
    // (If it's static JSON lacking a UUID DB record, we cannot insert it. 
    // For now we assume they are registering for events from the DB).
    // Let's just attempt insert and let DB constraints handle it.

    const { error } = await supabase
      .from("event_registrations")
      .insert({
        user_id: user.id,
        event_id: event_id
      });

    if (error) {
       // Code 23505 is unique violation (already registered)
      if (error.code === '23505') {
          return NextResponse.json({ error: "Bạn đã đăng ký tham gia sự kiện này rồi" }, { status: 400 });
      }
      console.error("Error inserting event registration:", error);
      return NextResponse.json({ error: "Tham gia thất bại, vui lòng thử lại." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("User event register API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const event_id = searchParams.get("event_id");

    if (!event_id) {
        return NextResponse.json({ error: "Missing event_id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", event_id);

    if (error) {
      console.error("Error deleting event registration:", error);
      return NextResponse.json({ error: "Hủy tham gia thất bại" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("User event unregister API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
