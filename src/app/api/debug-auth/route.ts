import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
      session: session,
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
      session: session,
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
