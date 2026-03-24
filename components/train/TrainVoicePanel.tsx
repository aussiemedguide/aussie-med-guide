"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useScribe } from "@elevenlabs/react";
import PulseOrb from "@/components/train/PulseOrb";

type OrbMode = "idle" | "speaking" | "listening" | "processing";
type VoiceProfile = "mmi" | "panel";

type Props = {
  question: string;
  selectedVoiceId: string;
  profile: VoiceProfile;
  onTranscriptFinalized: (text: string) => void;
};

export default function TrainVoicePanel({
  question,
  selectedVoiceId,
  profile,
  onTranscriptFinalized,
}: Props) {
  const assistantName =
    process.env.NEXT_PUBLIC_TRAIN_ASSISTANT_NAME || "Pulse";

  const [voiceMode, setVoiceMode] = useState(true);
  const [autoPlayQuestion, setAutoPlayQuestion] = useState(true);
  const [orbMode, setOrbMode] = useState<OrbMode>("idle");
  const [committedText, setCommittedText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onPartialTranscript: () => {
      setOrbMode("listening");
    },
    onCommittedTranscript: (data) => {
      setCommittedText((prev) => [prev, data.text].filter(Boolean).join(" ").trim());
    },
  });

  const liveTranscript = useMemo(() => {
    return [committedText, scribe.partialTranscript].filter(Boolean).join(" ").trim();
  }, [committedText, scribe.partialTranscript]);

  async function speakQuestion() {
    if (!voiceMode || !question || !selectedVoiceId) return;

    setOrbMode("speaking");

    try {
      const res = await fetch("/api/train/voice/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: question,
          voiceId: selectedVoiceId,
          profile,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to load question audio");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setOrbMode("idle");
        URL.revokeObjectURL(url);
      };

      await audio.play();
    } catch (error) {
      console.error(error);
      setOrbMode("idle");
    }
  }

  async function startListening() {
    try {
      setCommittedText("");
      setOrbMode("listening");

      const tokenRes = await fetch("/api/train/voice/scribe-token", {
        method: "GET",
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to get scribe token");
      }

      const tokenPayload = (await tokenRes.json()) as { token: string };

      await scribe.connect({
        token: tokenPayload.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } catch (error) {
      console.error(error);
      setOrbMode("idle");
    }
  }

  function stopListening() {
    scribe.disconnect();
    setOrbMode("processing");
  }

  function submitTranscript() {
    const finalText = liveTranscript.trim();
    if (!finalText) return;

    setOrbMode("idle");
    onTranscriptFinalized(finalText);
  }

  useEffect(() => {
    setCommittedText("");
    setOrbMode("idle");

    if (voiceMode && autoPlayQuestion && question) {
      void speakQuestion();
    }
  }, [question, profile, selectedVoiceId]);

  useEffect(() => {
    if (!scribe.isConnected && orbMode === "listening") {
      setOrbMode("idle");
    }
  }, [scribe.isConnected, orbMode]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-5 text-white shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Voice interviewer
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              {assistantName}
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              {profile === "mmi"
                ? "Dynamic station voice for faster MMI prompts."
                : "Calm panel voice for formal interview questions."}
            </p>
          </div>

          <PulseOrb mode={orbMode} enabled={voiceMode} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-2xl border border-slate-700 px-4 py-3">
            <span className="text-sm font-medium text-slate-200">Voice mode</span>
            <input
              type="checkbox"
              checked={voiceMode}
              onChange={(e) => setVoiceMode(e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-700 px-4 py-3">
            <span className="text-sm font-medium text-slate-200">
              Auto-play question
            </span>
            <input
              type="checkbox"
              checked={autoPlayQuestion}
              onChange={(e) => setAutoPlayQuestion(e.target.checked)}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => void speakQuestion()}
            disabled={!voiceMode}
            className="rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 disabled:opacity-50"
          >
            Replay question
          </button>

          <button
            onClick={() => void startListening()}
            disabled={!voiceMode || scribe.isConnected}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            Start answer
          </button>

          <button
            onClick={stopListening}
            disabled={!scribe.isConnected}
            className="rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 disabled:opacity-50"
          >
            Stop
          </button>

          <button
            onClick={submitTranscript}
            disabled={!liveTranscript}
            className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            Use transcript
          </button>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Live transcript
          </p>
          <p className="mt-2 min-h-20 whitespace-pre-wrap text-sm leading-6 text-slate-100">
            {liveTranscript || "Your spoken answer will appear here live."}
          </p>
        </div>
      </div>
    </div>
  );
}