"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { useUser } from "@clerk/nextjs";

function PostHogUserSync({ enabled }: { enabled: boolean }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!enabled || !isLoaded) return;

    if (user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
      });
    } else {
      posthog.reset();
    }
  }, [enabled, user, isLoaded]);

  return null;
}

export function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasInitialised = useRef(false);

  useEffect(() => {
    if (hasInitialised.current) return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key || !host) return;

    const initPostHog = () => {
      if (hasInitialised.current) return;

      posthog.init(key, {
        api_host: host,
        capture_pageview: false,
        capture_pageleave: true,
        person_profiles: "identified_only",
        session_recording: {
          maskAllInputs: false,
        },
      });

      hasInitialised.current = true;
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => {
        initPostHog();
      });

      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(() => {
      initPostHog();
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      <PostHogUserSync enabled={hasInitialised.current} />
      {children}
    </>
  );
}