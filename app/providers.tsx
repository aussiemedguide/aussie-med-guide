"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (!key) return;

    const timeout = setTimeout(() => {
      void import("posthog-js").then(({ default: posthog }) => {
        posthog.init(key, {
          api_host: host,
          person_profiles: "identified_only",
          capture_pageview: true,
          capture_pageleave: true,
          autocapture: false,
          capture_dead_clicks: false,
          disable_session_recording: true,
          disable_surveys: true,
        });
      });
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <>{children}</>;
}

export default PostHogProvider;