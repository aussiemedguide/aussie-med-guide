"use client";

import Link from "next/link";
import { useState } from "react";
import { Show, SignUpButton, useAuth } from "@clerk/nextjs";

type PlanKey = "oro_monthly" | "pro_annual";

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
  const { isSignedIn, getToken } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    const token = await getToken();

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  async function handleSignedInCheckout() {
    if (!accepted) {
      setError("Please accept the legal terms before continuing.");
      return;
    }

    if (!isSignedIn) {
      setError("Please create an account before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await recordConsent();
      await createCheckoutSession();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setLoading(false);
    }
  }

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

      <div className="mt-5">
        <Show when="signed-out">
          <SignUpButton
            mode="modal"
            forceRedirectUrl={`/pricing?plan=${plan}&accepted=true`}
          >
            <button
              type="button"
              disabled={!accepted}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to payment
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <button
            type="button"
            onClick={handleSignedInCheckout}
            disabled={!accepted || loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Starting checkout..." : "Continue to payment"}
          </button>
        </Show>
      </div>
    </div>
  );
}