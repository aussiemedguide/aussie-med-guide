import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export const runtime = "nodejs";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await elevenlabs.tokens.singleUse.create("realtime_scribe");

    return NextResponse.json(token);
  } catch (error) {
    console.error("Scribe token error:", error);

    return NextResponse.json(
      { error: "Failed to create scribe token" },
      { status: 500 }
    );
  }
}