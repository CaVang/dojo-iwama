import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // ==========================================
    // DEMO/SIMULATION MODE FOR LOCAL DEVELOPMENT 
    // ==========================================
    if (process.env.NODE_ENV === "development") {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/(^| )dev_simulated_role=([^;]+)/);
      const simulatedRole = match ? match[2] : null;

      if (simulatedRole === "dojo_chief" || simulatedRole === "admin") {
        console.log(`Bypassing auth for Dev Role: ${simulatedRole}`);
        const { data: mockRegistrations } = await supabase
          .from("dojo_registrations")
          .select("*")
          .order("created_at", { ascending: false });
          
        return NextResponse.json({ registrations: mockRegistrations || [] });
      }
    }

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find dojos owned by this user
    const { data: ownerships, error: ownershipError } = await supabase
      .from("dojo_owners")
      .select("dojo_id")
      .eq("user_id", user.id);

    if (ownershipError || !ownerships || ownerships.length === 0) {
      return NextResponse.json({ error: "Forbidden or no dojo found" }, { status: 403 });
    }

    // Extract dojo IDs
    const dojoIds = ownerships.map(o => o.dojo_id);

    // 3. Fetch registrations for those dojos
    // The RLS policies also protect this, but we explicitly filter by dojoIds as good practice
    const { data: registrations, error: fetchError } = await supabase
      .from("dojo_registrations")
      .select("*")
      .in("dojo_id", dojoIds)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching registrations:", fetchError);
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }

    return NextResponse.json({ registrations });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { id, status, class_id } = body;

    // ==========================================
    // DEMO/SIMULATION MODE FOR LOCAL DEVELOPMENT 
    // ==========================================
    if (process.env.NODE_ENV === "development") {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/(^| )dev_simulated_role=([^;]+)/);
      const simulatedRole = match ? match[2] : null;

      if (simulatedRole === "dojo_chief" || simulatedRole === "admin") {
        console.log(`Bypassing auth for Dev Role in PATCH: ${simulatedRole}`);
        const { data: fakeUpdate, error: upError } = await supabase
          .from("dojo_registrations")
          .update({ status })
          .eq("id", id)
          .select()
          .single();
          
        if (upError) {
          return NextResponse.json({ error: "Fail update fake registration" }, { status: 500 });
        }

        // Fake auto create student
        if (status === 'enrolled' && class_id && fakeUpdate) {
            const { error: studentError } = await supabase
              .from("dojo_students")
              .insert({
                dojo_id: fakeUpdate.dojo_id,
                class_id,
                registration_id: fakeUpdate.id,
                name: fakeUpdate.contact_name,
                contact_info: fakeUpdate.contact_info,
                status: 'active'
              });
            if (studentError) console.error("Error creating student in dev mode:", studentError);
        }
          
        return NextResponse.json({ success: true, registration: fakeUpdate });
      }
    }

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Attempt to update. RLS ensures the user can only update their own dojo's registrations.
    const { data: updatedReg, error } = await supabase
      .from("dojo_registrations")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !updatedReg) {
      console.error("Error updating registration:", error);
      return NextResponse.json({ error: "Failed to update registration status or unauthorized" }, { status: 500 });
    }

    // If status is enrolled and class_id is provided, create a student record
    if (status === 'enrolled' && class_id) {
        const { error: studentError } = await supabase
          .from("dojo_students")
          .insert({
            dojo_id: updatedReg.dojo_id,
            class_id,
            registration_id: updatedReg.id,
            name: updatedReg.contact_name,
            contact_info: updatedReg.contact_info,
            status: 'active'
          });
          
        if (studentError) {
           console.error("Error creating student from registration:", studentError);
        }
    }

    return NextResponse.json({ success: true, registration: updatedReg });
  } catch (error: any) {
    console.error("Dashboard update API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
