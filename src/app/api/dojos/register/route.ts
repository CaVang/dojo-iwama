import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      dojoId,
      dojoName,
      dojoEmail, // Used to send the email
      contactName,
      contactInfo,
      studentAge,
      message,
    } = body;

    // 1. Basic Validation
    if (!dojoId || !dojoName || !contactName || !contactInfo || !studentAge) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Save to Supabase `dojo_registrations`
    const supabase = await createClient();
    
    const { error: dbError } = await supabase.from("dojo_registrations").insert({
      dojo_id: dojoId,
      dojo_name: dojoName,
      contact_name: contactName,
      contact_info: contactInfo,
      student_age: studentAge,
      message: message || null,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save registration to database." },
        { status: 500 }
      );
    }

    // 3. Send Email using Resend (If applicable and configured)
    if (resend && dojoEmail) {
      try {
        const emailContent = `
          <h2>New Dojo Registration Request</h2>
          <p><strong>Dojo:</strong> ${dojoName}</p>
          <p><strong>Contact Name:</strong> ${contactName}</p>
          <p><strong>Contact Phone/Email:</strong> ${contactInfo}</p>
          <p><strong>Student Age:</strong> ${studentAge}</p>
          <p><strong>Message:</strong> ${message || "No message provided."}</p>
          <hr />
          <p>Please contact them back as soon as possible.</p>
        `;

        await resend.emails.send({
          from: "Dojo Iwama <onboarding@resend.dev>", // Replace with verified domain in production
          to: dojoEmail, 
          // If in Resend testing mode, it only sends to the verified email. 
          // You might need to change 'to' to your own email during dev.
          subject: `New Registration Request for ${dojoName}`,
          html: emailContent,
        });
      } catch (emailError) {
        console.error("Resend email error:", emailError);
        // Note: We don't fail the whole request if email fails, since DB saved successfully.
        // But in a real app you might want to log this or flag the DB record.
      }
    } else {
        console.log("Resend not configured or Dojo has no email. Skipping email notification.");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
