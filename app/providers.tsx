"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function PostHogProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (!key) return;

    const run = () => {
      const start = async () => {
        const posthogModule = await import("posthog-js");
        const posthog = posthogModule.default;

        posthog.init(key, {
          api_host: host,
          person_profiles: "identified_only",

          capture_pageview: true,
          capture_pageleave: true,
          autocapture: false,
          disable_session_recording: true,
          disable_surveys: true,

          loaded: () => {
            setEnabled(true);
          },
        });
      };

      void start();
    };

    const timeout = setTimeout(run, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <>{children}</>;
}

export default PostHogProvider;