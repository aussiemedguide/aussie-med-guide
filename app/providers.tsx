"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { useUser } from "@clerk/nextjs";

function PostHogUserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
      });
    } else {
      posthog.reset();
    }
  }, [user, isLoaded]);

  return null;
}

export function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key || !host) return;

    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
      session_recording: {
        maskAllInputs: false,
      },
    });
  }, []);

  return (
    <>
      <PostHogUserSync />
      {children}
    </>
  );
}