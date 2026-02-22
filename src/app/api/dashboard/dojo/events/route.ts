import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ==========================================
    // DEMO/SIMULATION MODE FOR LOCAL DEVELOPMENT 
    // ==========================================
    if (process.env.NODE_ENV === "development") {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/(^| )dev_simulated_role=([^;]+)/);
      const simulatedRole = match ? match[2] : null;

      if (simulatedRole === "dojo_chief" || simulatedRole === "admin") {
        console.log(`Bypassing auth for Dev Role in GET events: ${simulatedRole}`);
        // Fetch all events for simulation
        const { data: fakeEvents } = await supabase.from("dojo_events").select("*").order("date", { ascending: true });
        return NextResponse.json({ events: fakeEvents || [] });
      }
    }
    
    // Normal RLS handles getting mapping
    const { data: ownerMapping } = await supabase
      .from("dojo_owners")
      .select("dojo_id")
      .eq("user_id", authData.user.id);

    if (!ownerMapping || ownerMapping.length === 0) {
      return NextResponse.json({ error: "Thành viên không sở hữu võ đường nào" }, { status: 403 });
    }

    const dojoIds = ownerMapping.map((o) => o.dojo_id);

    // Fetch events 
    const { data: events, error } = await supabase
      .from("dojo_events")
      .select("*")
      .in("dojo_id", dojoIds)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching dojo events:", error);
      return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
    }

    return NextResponse.json({ events: events || [] });
  } catch (error: any) {
    console.error("Dashboard get events API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Default values if not provided
    if (!body.event_type) body.event_type = 'miscellaneous';
    if (!body.status) body.status = 'published';

    // ==========================================
    // DEMO/SIMULATION MODE FOR LOCAL DEVELOPMENT 
    // ==========================================
    if (process.env.NODE_ENV === "development") {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/(^| )dev_simulated_role=([^;]+)/);
      const simulatedRole = match ? match[2] : null;

      if (simulatedRole === "dojo_chief" || simulatedRole === "admin") {
        console.log(`Bypassing auth for Dev Role in POST event: ${simulatedRole}`);
        
        const dojo_id = body.dojo_id || "iwama-honbu"; 
        
        const { data: fakeInsert, error: insertError } = await supabase
          .from("dojo_events")
          .insert({
            dojo_id,
            title: body.title,
            description: body.description,
            date: body.date,
            end_date: body.end_date || null,
            location: body.location,
            image_url: body.image_url,
            event_type: body.event_type,
            instructor: body.instructor,
            status: body.status,
          })
          .select()
          .single();
          
        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
          
        return NextResponse.json({ success: true, event: fakeInsert });
      }
    }

    const { data: insertedEvent, error } = await supabase
      .from("dojo_events")
      .insert({
        dojo_id: body.dojo_id,
        title: body.title,
        description: body.description,
        date: body.date,
        end_date: body.end_date || null,
        location: body.location,
        image_url: body.image_url,
        event_type: body.event_type,
        instructor: body.instructor,
        status: body.status,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating dojo event:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: insertedEvent });
  } catch (error: any) {
    console.error("Dashboard post events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    // ==========================================
    // DEMO/SIMULATION MODE FOR LOCAL DEVELOPMENT 
    // ==========================================
    if (process.env.NODE_ENV === "development") {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/(^| )dev_simulated_role=([^;]+)/);
      const simulatedRole = match ? match[2] : null;

      if (simulatedRole === "dojo_chief" || simulatedRole === "admin") {
        console.log(`Bypassing auth for Dev Role in DELETE event: ${simulatedRole}`);
        const { error: delError } = await supabase
          .from("dojo_events")
          .delete()
          .eq("id", id);
          
        if (delError) {
          return NextResponse.json({ error: "Fail delete" }, { status: 500 });
        }
        return NextResponse.json({ success: true });
      }
    }
    
    // Normal RLS takes effect
    const { error } = await supabase
      .from("dojo_events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting event:", error);
      return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Dashboard delete event API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
