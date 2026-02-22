import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
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
        console.log(`Bypassing auth for Dev Role in Students: ${simulatedRole}`);
        const { data: mockStudents } = await supabase
          .from("dojo_students")
          .select("*, dojo_classes(name)")
          .order("created_at", { ascending: false });
          
        return NextResponse.json({ students: mockStudents || [] });
      }
    }

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find dojos owned by this user
    const { data: ownerships, error: ownershipError } = await supabase
      .from("dojo_owners")
      .select("dojo_id")
      .eq("user_id", user.id);

    if (ownershipError || !ownerships || ownerships.length === 0) {
      return NextResponse.json({ error: "Forbidden or no dojo found" }, { status: 403 });
    }

    const dojoIds = ownerships.map(o => o.dojo_id);

    // Fetch students
    const { data: students, error: fetchError } = await supabase
      .from("dojo_students")
      .select("*, dojo_classes(name)")
      .in("dojo_id", dojoIds)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching students:", fetchError);
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }

    return NextResponse.json({ students });
  } catch (error: any) {
    console.error("Dashboard students API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { id, current_belt, tuition_paid_until } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing student id" }, { status: 400 });
    }

    // ==========================================
    // DEMO/SIMULATION MODE FOR LOCAL DEVELOPMENT 
    // ==========================================
    if (process.env.NODE_ENV === "development") {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/(^| )dev_simulated_role=([^;]+)/);
      const simulatedRole = match ? match[2] : null;

      if (simulatedRole === "dojo_chief" || simulatedRole === "admin") {
        console.log(`Bypassing auth for Dev Role in PATCH student: ${simulatedRole}`);
        const { data: fakeUpdate, error: upError } = await supabase
          .from("dojo_students")
          .update({ current_belt, tuition_paid_until })
          .eq("id", id)
          .select()
          .single();
          
        if (upError) {
          return NextResponse.json({ error: "Fail update fake student" }, { status: 500 });
        }
          
        return NextResponse.json({ success: true, student: fakeUpdate });
      }
    }

    // Attempt to update. RLS ensures the user can only update their own dojo's students.
    const { data: updatedStudent, error } = await supabase
      .from("dojo_students")
      .update({ current_belt, tuition_paid_until })
      .eq("id", id)
      .select()
      .single();

    if (error || !updatedStudent) {
      console.error("Error updating student:", error);
      return NextResponse.json({ error: "Failed to update student or unauthorized" }, { status: 500 });
    }

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error: any) {
    console.error("Dashboard update student API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
