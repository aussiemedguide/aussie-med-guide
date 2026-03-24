"use client";

import { motion } from "framer-motion";

type Mode = "idle" | "speaking" | "listening" | "processing";

export default function PulseOrb({
  mode,
  enabled,
}: {
  mode: Mode;
  enabled: boolean;
}) {
  const isSpeaking = mode === "speaking";
  const isListening = mode === "listening";
  const isProcessing = mode === "processing";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <motion.div
        className={enabled ? "absolute h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" : "absolute h-32 w-32 rounded-full bg-slate-300/20 blur-3xl"}
        animate={{
          scale: isSpeaking ? [1, 1.24, 1.04] : isListening ? [1, 1.3, 1.08] : isProcessing ? [1, 1.12, 1] : [1, 1.08, 1],
          opacity: isSpeaking ? [0.4, 0.9, 0.45] : isListening ? [0.45, 1, 0.55] : isProcessing ? [0.35, 0.7, 0.35] : [0.28, 0.45, 0.28],
        }}
        transition={{
          duration: isListening ? 0.85 : isSpeaking ? 1 : 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={enabled ? "absolute h-28 w-28 rounded-full border border-cyan-200/60" : "absolute h-28 w-28 rounded-full border border-slate-200/60"}
        animate={{
          rotate: isProcessing ? 360 : 0,
          scale: isSpeaking ? [1, 1.08, 1] : isListening ? [1, 1.12, 1] : [1, 1.03, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.div
        className={enabled ? "absolute h-20 w-20 rounded-full border border-blue-200/70 bg-white/10 backdrop-blur-md" : "absolute h-20 w-20 rounded-full border border-slate-200/70 bg-white/10 backdrop-blur-md"}
        animate={{
          scale: isSpeaking ? [1, 1.1, 1] : isListening ? [1, 1.14, 1] : [1, 1.04, 1],
          rotate: isProcessing ? -360 : 0,
        }}
        transition={{
          scale: {
            duration: isListening ? 0.9 : 1.7,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      <motion.div
        className={
          enabled
            ? "relative h-12 w-12 rounded-full bg-linear-to-br from-cyan-300 via-sky-400 to-violet-500 shadow-lg shadow-cyan-400/30"
            : "relative h-12 w-12 rounded-full bg-slate-300"
        }
        animate={{
          scale: isSpeaking ? [1, 1.16, 1] : isListening ? [1, 1.22, 1] : [1, 1.05, 1],
          opacity: [0.9, 1, 0.92],
        }}
        transition={{
          duration: isListening ? 0.85 : isSpeaking ? 1 : 2.1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={enabled ? "pointer-events-none absolute h-3 w-3 rounded-full bg-white/90" : "pointer-events-none absolute h-3 w-3 rounded-full bg-white/60"}
        animate={{
          x: isProcessing ? [0, 18, 0, -18, 0] : [0, 10, 0],
          y: isProcessing ? [0, -10, 0, 10, 0] : [0, -6, 0],
          opacity: [0.35, 0.95, 0.35],
        }}
        transition={{
          duration: isProcessing ? 3.2 : 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}