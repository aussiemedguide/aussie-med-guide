"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PlanKey = "monthly" | "annual";

type PricingCardProps = {
  planName: string;
  priceLabel: string;
  plan: PlanKey;
};

const CONSENT_VERSION = "2026-03-14";

export function PricingCard({
  planName,
  priceLabel,
  plan,
}: PricingCardProps) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasAutoResumed = useRef(false);

  async function startGoogleSignIn() {
    const supabase = createClient();

    localStorage.setItem("pendingCheckoutPlan", plan);
    localStorage.setItem("pendingCheckoutPlanName", planName);
    localStorage.setItem("pendingCheckoutAccepted", accepted ? "true" : "false");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message || "Could not start Google sign-in.");
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    throw new Error("No Google sign-in URL was returned.");
  }

  async function recordConsent() {
    const consentResponse = await fetch("/api/legal-consent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acceptedTerms: true,
        acceptedPrivacy: true,
        acceptedPayments: true,
        acceptedDisclaimer: true,
        version: CONSENT_VERSION,
        source: "pricing_checkout",
      }),
    });

    if (!consentResponse.ok) {
      const data = await consentResponse.json().catch(() => null);
      throw new Error(data?.error || "Unable to record legal acceptance.");
    }
  }

  async function createCheckoutSession() {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    const data = (await response.json()) as {
      url?: string;
      error?: string;
    };

    if (!response.ok || !data.url) {
      throw new Error(data.error || "Unable to start checkout.");
    }

    window.location.href = data.url;
  }

  async function handleCheckout() {
    if (!accepted) {
      setError("Please accept the legal terms before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;

      if (!user || !user.email) {
        await startGoogleSignIn();
        return;
      }

      await recordConsent();
      await createCheckoutSession();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setLoading(false);
    }
  }

  useEffect(() => {
    async function resumePendingCheckout() {
      if (hasAutoResumed.current) return;

      const pendingPlan = localStorage.getItem("pendingCheckoutPlan");
      const pendingAccepted = localStorage.getItem("pendingCheckoutAccepted");

      if (pendingPlan !== plan) return;
      if (pendingAccepted !== "true") return;

      hasAutoResumed.current = true;
      setAccepted(true);
      setLoading(true);
      setError("");

      try {
        const supabase = createClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user ?? null;

        if (!user || !user.email) {
          setLoading(false);
          return;
        }

        localStorage.removeItem("pendingCheckoutPlan");
        localStorage.removeItem("pendingCheckoutPlanName");
        localStorage.removeItem("pendingCheckoutAccepted");

        await recordConsent();
        await createCheckoutSession();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        setLoading(false);
      }
    }

    void resumePendingCheckout();
  }, [plan]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
        {planName}
      </div>

      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
        {priceLabel}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Full access to premium Aussie Med Guide tools and trackers.
      </p>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        Before you continue, please read and accept our{" "}
        <Link
          href="/legal/terms-of-use"
          className="font-semibold text-slate-900 underline underline-offset-4"
        >
          Terms of Use
        </Link>
        ,{" "}
        <Link
          href="/legal/privacy-policy"
          className="font-semibold text-slate-900 underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        ,{" "}
        <Link
          href="/legal/educational-disclaimer"
          className="font-semibold text-slate-900 underline underline-offset-4"
        >
          Educational Disclaimer
        </Link>
        , and{" "}
        <Link
          href="/legal/payments-subscription-terms"
          className="font-semibold text-slate-900 underline underline-offset-4"
        >
          Payments & Subscription Terms
        </Link>
        .
      </div>

      <label className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />
        <span>
          I have read and agree to the Terms of Use, Privacy Policy,
          Educational Disclaimer, and Payments & Subscription Terms.
        </span>
      </label>

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      ) : null}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={!accepted || loading}
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Starting checkout..." : "Continue to payment"}
      </button>
    </div>
  );
}