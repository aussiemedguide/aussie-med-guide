import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("experience_entries")
      .select("*")
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET experience_entries error:", error);
      return NextResponse.json(
        { error: "Failed to fetch experience entries" },
        { status: 500 }
      );
    }

    return NextResponse.json({ entries: data });
  } catch (error) {
    console.error("GET route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      userId,
      title,
      organization,
      category,
      status,
      startDate,
      endDate,
      totalHours,
      description,
      reflection,
    } = await req.json();

    if (!userId || !title || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("experience_entries")
      .insert({
        clerk_user_id: userId,
        title,
        organization: organization || null,
        category,
        status: status || "Ongoing",
        start_date: startDate || null,
        end_date: endDate || null,
        total_hours: totalHours ? Number(totalHours) : null,
        description: description || null,
        reflection: reflection || null,
      })
      .select()
      .single();

    if (error) {
      console.error("POST experience_entries error:", error);
      return NextResponse.json(
        { error: "Failed to save experience entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ entry: data });
  } catch (error) {
    console.error("POST route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, userId } = await req.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Missing id or userId" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("experience_entries")
      .delete()
      .eq("id", id)
      .eq("clerk_user_id", userId);

    if (error) {
      console.error("DELETE experience_entries error:", error);
      return NextResponse.json(
        { error: "Failed to delete experience entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}