"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Check, Crown } from "lucide-react";

type PlanKey = "free" | "pro_monthly" | "pro_annual";

type PricingFlowProps = {
  isSignedIn: boolean;
  userEmail: string;
};

const CONSENT_VERSION = "2026-03-21";

const PLAN_COPY: Record<
  PlanKey,
  {
    label: string;
    price: string;
    description: string;
    bullets: string[];
    cta: string;
  }
> = {
  free: {
    label: "Free",
    price: "$0",
    description: "Start planning with the essential Command dashboard.",
    bullets: [
      "Core Command dashboard",
      "Key dates calendar",
      "Custom personal deadlines",
      "Basic profile and shortlist saving",
    ],
    cta: "Start free",
  },
  pro_monthly: {
    label: "Pro Monthly",
    price: "$9.99 / month",
    description: "Unlock premium planning tools with flexible monthly billing.",
    bullets: [
      "Everything in Free",
      "Premium Command modules",
      "Deeper tracking and momentum tools",
      "Expanded planning features",
    ],
    cta: "Continue to secure checkout",
  },
  pro_annual: {
    label: "Pro Annual",
    price: "$99.99 / year",
    description: "Best value if you want the full system for the whole cycle.",
    bullets: [
      "Everything in Pro Monthly",
      "Lower yearly cost",
      "Best value for long-term prep",
      "Full premium Command access",
    ],
    cta: "Continue to secure checkout",
  },
};

type ViewedState = {
  terms: boolean;
  privacy: boolean;
  disclaimer: boolean;
  payments: boolean;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PricingFlow({ isSignedIn, userEmail }: PricingFlowProps) {
  const router = useRouter();
  const { getToken } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("pro_annual");
  const [viewed, setViewed] = useState<ViewedState>({
    terms: false,
    privacy: false,
    disclaimer: false,
    payments: false,
  });
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const plan = PLAN_COPY[selectedPlan];

  const allDocsViewed = useMemo(() => {
    return Object.values(viewed).every(Boolean);
  }, [viewed]);

  function markViewed(key: keyof ViewedState) {
    setViewed((current) => ({ ...current, [key]: true }));
  }

  async function recordConsent() {
    const response = await fetch("/api/legal-consent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: CONSENT_VERSION,
        acceptedTerms: true,
        acceptedPrivacy: true,
        acceptedPayments: true,
        acceptedDisclaimer: true,
        source: "pricing_page",
        plan: selectedPlan,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
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
      body: JSON.stringify({
        plan: selectedPlan,
      }),
    });

    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      throw new Error(data.error || "Unable to start checkout.");
    }

    window.location.href = data.url;
  }

  async function handleContinue() {
    if (!allDocsViewed) {
      setError("Open each legal document before continuing.");
      return;
    }

    if (!accepted) {
      setError("Please confirm that you agree to the legal terms.");
      return;
    }

    if (!isSignedIn) {
      setError("Please sign in first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await recordConsent();

      if (selectedPlan === "free") {
        router.push("/tools/command");
        return;
      }

      await createCheckoutSession();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Step 1
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Pick your plan
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {(["free", "pro_monthly", "pro_annual"] as PlanKey[]).map((key) => {
            const item = PLAN_COPY[key];
            const active = selectedPlan === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPlan(key)}
                className={cn(
                  "rounded-3xl border p-5 text-left transition",
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-white"
                )}
              >
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="mt-3 text-2xl font-bold">{item.price}</div>
                <div
                  className={cn(
                    "mt-2 text-sm leading-6",
                    active ? "text-white/80" : "text-slate-600"
                  )}
                >
                  {item.description}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <div className="text-lg font-semibold text-slate-950">
              {plan.label}
            </div>
          </div>

          <div className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {plan.price}
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {plan.description}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {plan.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
              >
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Step 2
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Review legal terms
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Open each document before confirming. Once signed in, your acceptance
          is recorded with a timestamp and version.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/legal/terms-of-use"
            target="_blank"
            onClick={() => markViewed("terms")}
            className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900"
          >
            Terms of Use {viewed.terms ? "✓" : ""}
          </Link>

          <Link
            href="/legal/privacy-policy"
            target="_blank"
            onClick={() => markViewed("privacy")}
            className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900"
          >
            Privacy Policy {viewed.privacy ? "✓" : ""}
          </Link>

          <Link
            href="/legal/educational-disclaimer"
            target="_blank"
            onClick={() => markViewed("disclaimer")}
            className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900"
          >
            Educational Disclaimer {viewed.disclaimer ? "✓" : ""}
          </Link>

          <Link
            href="/legal/payments-subscription-terms"
            target="_blank"
            onClick={() => markViewed("payments")}
            className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900"
          >
            Payments & Subscription Terms {viewed.payments ? "✓" : ""}
          </Link>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <input
            type="checkbox"
            checked={accepted}
            disabled={!allDocsViewed}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300"
          />
          <span>
            I have opened and reviewed the Terms of Use, Privacy Policy,
            Educational Disclaimer, and Payments & Subscription Terms, and I
            agree to them.
          </span>
        </label>

        {!isSignedIn ? (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="text-sm font-semibold text-blue-950">
              Step 3
            </div>
            <p className="mt-2 text-sm text-blue-900">
              Sign in with Google before continuing so your plan, dashboard, and
              legal acceptance can be linked to your account.
            </p>

            <div className="mt-4">
              <SignInButton mode="modal" forceRedirectUrl="/pricing">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Continue with Google
                </button>
              </SignInButton>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-sm font-semibold text-emerald-950">
              Signed in
            </div>
            <p className="mt-2 text-sm text-emerald-900">
              {userEmail || "Your account is ready"}.
            </p>
          </div>
        )}

        {error ? (
          <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="mt-6">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isSignedIn || !accepted || loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Working..." : plan.cta}
          </button>
        </div>
      </section>
    </div>
  );
}