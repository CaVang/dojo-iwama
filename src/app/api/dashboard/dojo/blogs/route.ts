import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Setup local dev override
    let dojoIds: string[] = [];

    if (process.env.NODE_ENV === "development") {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/(^| )dev_simulated_role=([^;]+)/);
      const simulatedRole = match ? match[2] : null;

      if (simulatedRole === "dojo_chief" || simulatedRole === "admin") {
        const { data: allDojos } = await supabase.from("dojos").select("id").limit(1);
        if (allDojos && allDojos.length > 0) {
          dojoIds = [allDojos[0].id];
        } else {
           // fallback generic dojo tracking
           dojoIds = ["dojo-1"]; 
        }
      }
    }

    if (!dojoIds.length) {
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { data: ownerships, error: ownerError } = await supabase
        .from("dojo_owners")
        .select("dojo_id")
        .eq("user_id", user.id);

      if (ownerError || !ownerships || ownerships.length === 0) {
        return NextResponse.json({ error: "No dojos found for this user." }, { status: 403 });
      }
      dojoIds = ownerships.map((o) => o.dojo_id);
    }

    const { searchParams } = new URL(req.url);
    const event_id = searchParams.get("event_id");
    
    let query = supabase
      .from("dojo_blogs")
      .select("*")
      .in("dojo_id", dojoIds)
      .order("created_at", { ascending: false });

    if (event_id) {
       query = query.eq("event_id", event_id);
    }

    const { data: blogs, error } = await query;

    if (error) {
      console.error("Supabase Error (Blogs GET):", error);
      return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }

    return NextResponse.json({ blogs });
  } catch (error: any) {
    console.error("Dashboard Blogs API GET error:", error);
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

    const body = await req.json();
    const { dojo_id, event_id, title, summary, content, image_url, status } = body;

    // Verify ownership
    const { data: ownership } = await supabase
      .from("dojo_owners")
      .select("*")
      .eq("user_id", user.id)
      .eq("dojo_id", dojo_id)
      .single();

    if (!ownership && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Forbidden: Not owner of this dojo." }, { status: 403 });
    }

    const { data: blog, error } = await supabase
      .from("dojo_blogs")
      .insert({
        dojo_id,
        event_id: event_id || null,
        author_id: user.id,
        title,
        summary,
        content,
        image_url,
        status: status || 'published'
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Error (Blogs POST):", error);
      return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error: any) {
    console.error("Dashboard Blogs API POST error:", error);
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
    const blog_id = searchParams.get("id");
    const dojo_id = searchParams.get("dojo_id");

    if (!blog_id || !dojo_id) {
      return NextResponse.json({ error: "Missing required params" }, { status: 400 });
    }

    const { data: ownership } = await supabase
      .from("dojo_owners")
      .select("*")
      .eq("user_id", user.id)
      .eq("dojo_id", dojo_id)
      .single();

    if (!ownership && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Forbidden: Not owner of this dojo." }, { status: 403 });
    }

    const { error } = await supabase
      .from("dojo_blogs")
      .delete()
      .eq("id", blog_id)
      .eq("dojo_id", dojo_id);

    if (error) {
      console.error("Supabase Error (Blogs DELETE):", error);
      return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Dashboard Blogs API DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
   // Patch similar to POST but with `eq("id", id)`
   try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, dojo_id, event_id, title, summary, content, image_url, status } = body;

    const { data: ownership } = await supabase
      .from("dojo_owners")
      .select("*")
      .eq("user_id", user.id)
      .eq("dojo_id", dojo_id)
      .single();

    if (!ownership && process.env.NODE_ENV !== "development") {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: blog, error } = await supabase
      .from("dojo_blogs")
      .update({
        event_id: event_id || null,
        title,
        summary,
        content,
        image_url,
        status: status || 'published',
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("dojo_id", dojo_id)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error (Blogs PATCH):", error);
      return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
    }

    return NextResponse.json({ blog });
  } catch (error: any) {
    console.error("Dashboard Blogs API PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
