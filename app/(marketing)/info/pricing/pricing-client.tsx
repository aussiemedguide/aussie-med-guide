"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Crown, HelpCircle, ShieldCheck, Zap } from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";

type CurrentPlan = "free" | "pro_monthly" | "pro_annual";

type Plan = {
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  badge?: string;
  tone: string;
  buttonTone: string;
  cta: string;
  href?: string;
  planKey?: "pro_monthly" | "pro_annual";
  features: string[];
  note?: string;
};

const CONSENT_VERSION = "2026-03-14";

const plans: Plan[] = [
  {
    name: "Free",
    subtitle: "Perfect to explore and plan",
    price: "$0",
    suffix: "/forever",
    tone: "border-slate-200 bg-white",
    buttonTone:
      "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    cta: "Current Plan",
    href: "/",
    features: [
      "Home dashboard",
      "Student Classification Guide",
      "Medical Schools Directory",
      "Entry Statistics",
      "University Rankings",
      "Choose Your Uni tool",
    ],
  },
  {
    name: "Pro Monthly",
    subtitle: "Full access, cancel anytime",
    price: "$9.99",
    suffix: "/month",
    badge: "Most Popular",
    tone: "border-blue-300 bg-blue-50/40",
    buttonTone: "bg-blue-600 text-white hover:bg-blue-700",
    cta: "Continue to payment",
    planKey: "pro_monthly",
    features: [
      "Personalised Roadmap Score and Competitiveness Intel",
      "Custom roadmap based on your Year and Targets",
      "UCAT and interview performance tracker",
      "What-if optimisation engine",
      "Application strategy and school-ranking tool",
      "Scholarship and financial planning tracker",
      "Live deadline alerts and key date monitoring",
      "Command dashboard with weekly action priorities",
      "Priority support",
    ],
    note:
      "Great if you want flexibility while building the first paid version.",
  },
  {
    name: "Pro Annual",
    subtitle: "Less than $8.35/month. Best value.",
    price: "$99.99",
    suffix: "/year",
    badge: "Best Value",
    tone: "border-emerald-300 bg-emerald-50/50",
    buttonTone: "bg-emerald-600 text-white hover:bg-emerald-700",
    cta: "Continue to payment",
    planKey: "pro_annual",
    features: [
      "Everything in Pro Monthly",
      "Lowest effective price for the year",
      "Full access through the application cycle",
      "Priority product updates as new tools launch",
      "Best option for Year 12 or gap-year students",
    ],
    note:
      "Best for users who know they’ll use the full platform across the cycle.",
  },
];

const faqs = [
  {
    q: "Can I switch between plans?",
    a: "Yes. You can upgrade or downgrade later once your subscription management flow is fully enabled.",
  },
  {
    q: "What payment methods are supported first?",
    a: "Start with Stripe Checkout card payments. Add wallets later after the basic billing flow is stable.",
  },
  {
    q: "What happens when someone cancels?",
    a: "Access should remain active until the end of the paid billing period, then downgrade to Free automatically.",
  },
  {
    q: "How do saved tools work per account?",
    a: "Each signed-in user stores tracker data, saved universities, deadlines, and tool outputs in their own account.",
  },
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function PricingCard({
  plan,
  featured = false,
  onCheckout,
  loadingPlan,
  isSignedIn,
  currentPlan,
}: {
  plan: Plan;
  featured?: boolean;
  onCheckout: (plan: "pro_monthly" | "pro_annual", accepted: boolean) => void;
  loadingPlan: string | null;
  isSignedIn: boolean;
  currentPlan: CurrentPlan;
}) {
  const isPaidPlan = !!plan.planKey;
  const isLoading = loadingPlan === plan.planKey;
  const [accepted, setAccepted] = useState(false);

  const isCurrentFree = !plan.planKey && currentPlan === "free";
  const isCurrentPaid = !!plan.planKey && currentPlan === plan.planKey;
  const isCurrentPlan = isCurrentFree || isCurrentPaid;

  const buttonLabel = !isPaidPlan
  ? isCurrentFree
    ? "Current Plan"
    : "Downgrade to Free"
  : isCurrentPaid
    ? "Current Plan"
    : currentPlan === "pro_monthly" && plan.planKey === "pro_annual"
      ? "Switch to Annual"
      : currentPlan === "pro_annual" && plan.planKey === "pro_monthly"
        ? "Switch to Monthly"
        : isSignedIn
          ? "Continue to payment"
          : "Sign in to continue";

  const buttonDisabled = !isPaidPlan
  ? isCurrentFree
  : isCurrentPaid || isLoading || (!accepted && !isCurrentPaid);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cx(
        "relative rounded-3xl border p-6 shadow-sm",
        plan.tone,
        featured ? "scale-[1.01]" : ""
      )}
    >
      {plan.badge ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-sm">
          {plan.badge}
        </div>
      ) : null}

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
        {plan.name === "Free" ? (
          <ShieldCheck className="h-5 w-5 text-slate-500" />
        ) : plan.name === "Pro Monthly" ? (
          <Zap className="h-5 w-5 text-blue-600" />
        ) : (
          <Crown className="h-5 w-5 text-emerald-600" />
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-2xl font-black tracking-tight text-slate-950">
          {plan.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{plan.subtitle}</p>
      </div>

      <div className="mt-5 flex items-end gap-1">
        <span className="text-5xl font-black tracking-tight text-slate-950">
          {plan.price}
        </span>
        <span className="pb-1 text-sm text-slate-500">{plan.suffix}</span>
      </div>

      {isCurrentPlan ? (
        <div className="mt-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {isPaidPlan ? "Current Subscription" : "Current Plan"}
        </div>
      ) : null}

      {isPaidPlan ? (
        <>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-700">
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
              disabled={isCurrentPaid}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              I have read and agree to the Terms of Use, Privacy Policy,
              Educational Disclaimer, and Payments & Subscription Terms.
            </span>
          </label>

          <button
            type="button"
            onClick={() => plan.planKey && onCheckout(plan.planKey, accepted)}
            disabled={buttonDisabled}
            className={cx(
              "mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
              plan.buttonTone
            )}
          >
            {isLoading ? "Redirecting..." : buttonLabel}
          </button>
        </>
      ) : (
        <Link
          href={plan.href ?? "/"}
          className={cx(
            "mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition",
            plan.buttonTone
          )}
        >
          {buttonLabel}
        </Link>
      )}

      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {plan.note ? (
        <p className="mt-5 text-xs leading-5 text-slate-500">{plan.note}</p>
      ) : null}
    </motion.div>
  );
}

export default function PricingClient({
  currentPlan,
}: {
  currentPlan: CurrentPlan;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const hasResumedRef = useRef(false);

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

    const data = await consentResponse.json().catch(() => null);

    if (!consentResponse.ok) {
      throw new Error(data?.error || "Unable to record legal acceptance.");
    }
  }

  async function createCheckout(plan: "pro_monthly" | "pro_annual") {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error || "Failed to start checkout.");
    }

    if (!data?.url) {
      throw new Error("No checkout URL returned.");
    }

    window.location.href = data.url;
  }

  const handleCheckout = async (
    plan: "pro_monthly" | "pro_annual",
    accepted: boolean
  ) => {
    if (!accepted) {
      setPageError("Please accept the legal terms before continuing.");
      return;
    }

    if (!isLoaded) {
      setPageError("Authentication is still loading. Please try again.");
      return;
    }

    try {
      setPageError("");
      setLoadingPlan(plan);

      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
        localStorage.setItem("pendingCheckoutPlan", plan);
        localStorage.setItem("pendingCheckoutAccepted", "true");

        await clerk.redirectToSignIn({
          signInFallbackRedirectUrl: "/info/pricing",
          signUpFallbackRedirectUrl: "/info/pricing",
        });

        return;
      }

      await recordConsent();
      await createCheckout(plan);
    } catch (error) {
      console.error("Checkout error:", error);
      setPageError(
        error instanceof Error
          ? error.message
          : "Something went wrong starting checkout."
      );
      setLoadingPlan(null);
    }
  };

  useEffect(() => {
    async function resumeCheckoutIfNeeded() {
      if (hasResumedRef.current) return;
      if (!isLoaded) return;
      if (!isSignedIn) return;

      const pendingPlan = localStorage.getItem("pendingCheckoutPlan");
      const pendingAccepted = localStorage.getItem("pendingCheckoutAccepted");

      if (!pendingPlan || pendingAccepted !== "true") return;
      if (pendingPlan !== "pro_monthly" && pendingPlan !== "pro_annual") return;

      hasResumedRef.current = true;

      try {
        localStorage.removeItem("pendingCheckoutPlan");
        localStorage.removeItem("pendingCheckoutAccepted");

        setLoadingPlan(pendingPlan);
        setPageError("");

        await recordConsent();
        await createCheckout(pendingPlan);
      } catch (error) {
        console.error("Resume checkout error:", error);
        setPageError(
          error instanceof Error
            ? error.message
            : "Something went wrong resuming checkout."
        );
        setLoadingPlan(null);
      }
    }

    void resumeCheckoutIfNeeded();
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      const timer = setTimeout(() => {
        router.refresh();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 shadow-sm">
            Beta Phase — Limited Access
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Get Access to Everything You Need
          </h1>
          <p className="mt-3 text-base leading-8 text-slate-600 sm:text-lg">
            From exploration to execution. Choose the plan that fits your
            medicine journey.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-5xl rounded-3xl bg-slate-950 px-6 py-5 text-center text-white shadow-lg">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/85">
            Early Beta Access
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Aussie Med Guide is currently in early beta. Features are actively
            being built and improved. You are getting early access at a reduced
            price in exchange for being part of this phase.
          </p>
        </div>

        {pageError ? (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {pageError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <PricingCard
            plan={plans[0]}
            onCheckout={handleCheckout}
            loadingPlan={loadingPlan}
            isSignedIn={!!isSignedIn}
            currentPlan={currentPlan}
          />
          <PricingCard
            plan={plans[1]}
            featured
            onCheckout={handleCheckout}
            loadingPlan={loadingPlan}
            isSignedIn={!!isSignedIn}
            currentPlan={currentPlan}
          />
          <PricingCard
            plan={plans[2]}
            onCheckout={handleCheckout}
            loadingPlan={loadingPlan}
            isSignedIn={!!isSignedIn}
            currentPlan={currentPlan}
          />
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-center">
            <HelpCircle className="h-5 w-5 text-slate-500" />
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-6 divide-y divide-slate-200">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-4">
                <p className="font-semibold text-slate-950">{faq.q}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-6 text-slate-500">
          Aussie Med Guide is an educational resource and is not affiliated
          with any university or admissions body. Always verify final details
          with official sources.
        </p>
      </div>
    </div>
  );
}