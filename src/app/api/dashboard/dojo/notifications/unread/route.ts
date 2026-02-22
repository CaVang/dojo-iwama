import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // ==========================================
    // DEMO/SIMULATION MODE FOR LOCAL DEVELOPMENT 
    // ==========================================
    if (process.env.NODE_ENV === "development") {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/(^| )dev_simulated_role=([^;]+)/);
      const simulatedRole = match ? match[2] : null;

      if (simulatedRole === "dojo_chief" || simulatedRole === "admin") {
        const { count, error } = await supabase
          .from("dojo_registrations")
          .select("*", { count: 'exact', head: true })
          .eq("status", "pending");
          
        if (error) {
           console.error("Local count error:", error);
           return NextResponse.json({ unreadCount: 0 });
        }
        return NextResponse.json({ unreadCount: count || 0 });
      }
    }

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Normal RLS
    const { data: ownerships, error: ownerError } = await supabase
      .from("dojo_owners")
      .select("dojo_id")
      .eq("user_id", user.id);

    if (ownerError || !ownerships || ownerships.length === 0) {
      return NextResponse.json({ unreadCount: 0 });
    }

    const dojoIds = ownerships.map((o) => o.dojo_id);

    // Get count
    const { count, error } = await supabase
      .from("dojo_registrations")
      .select("*", { count: "exact", head: true })
      .in("dojo_id", dojoIds)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching unread count:", error);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({ unreadCount: count || 0 });
  } catch (error: any) {
    console.error("Unread Notification API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
