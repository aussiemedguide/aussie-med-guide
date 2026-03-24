import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

type Body = {
  text?: string;
  voiceId?: string;
  profile?: "mmi" | "panel";
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const text = body.text?.trim();
    const voiceId = body.voiceId?.trim();
    const profile = body.profile ?? "panel";

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    if (!voiceId) {
      return NextResponse.json({ error: "Missing voiceId" }, { status: 400 });
    }

    const voiceSettings =
      profile === "mmi"
        ? {
            stability: 0.45,
            similarity_boost: 0.8,
            style: 0.1,
            use_speaker_boost: true,
          }
        : {
            stability: 0.62,
            similarity_boost: 0.82,
            style: 0.06,
            use_speaker_boost: true,
          };

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          voice_settings: voiceSettings,
        }),
        cache: "no-store",
      }
    );

    if (!elevenRes.ok) {
      const errorText = await elevenRes.text();
      console.error("ElevenLabs TTS error:", errorText);

      return NextResponse.json(
        { error: "Failed to generate question audio" },
        { status: 500 }
      );
    }

    const audioBuffer = await elevenRes.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Question voice error:", error);

    return NextResponse.json(
      { error: "Failed to generate question audio" },
      { status: 500 }
    );
  }
}