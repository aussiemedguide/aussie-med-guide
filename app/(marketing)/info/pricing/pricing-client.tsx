"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  Crown,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";

type CurrentPlan = "free" | "pro_monthly" | "pro_annual";

type Plan = {
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  badge?: string;
  planKey?: "pro_monthly" | "pro_annual";
  cta: string;
  href?: string;
  valueLabel: string;
  savingsLine?: string;
  commitmentLine?: string;
  tone: "free" | "monthly" | "annual";
  features: string[];
  note?: string;
  annualBonus?: string[];
};

const CONSENT_VERSION = "2026-03-14";

const plans: Plan[] = [
  {
    name: "Free",
    subtitle: "Explore the platform before committing.",
    price: "$0",
    suffix: "/forever",
    cta: "Stay on Free",
    href: "/",
    valueLabel: "Best for early exploration",
    tone: "free",
    features: [
      "Home dashboard",
      "Student Classification Guide",
      "Medical Schools Directory",
      "Entry Statistics",
      "University Rankings",
      "Choose Your Uni tool",
    ],
    note:
      "Good for understanding the landscape, comparing universities, and seeing how the platform works.",
  },
  {
    name: "Pro Monthly",
    subtitle: "Flexible Pro access with full premium tools.",
    price: "$9.99",
    suffix: "/month",
    badge: "Flexible Access",
    planKey: "pro_monthly",
    cta: "Pro Starter",
    valueLabel: "Good for getting started with Pro",
    commitmentLine: "Best if you want flexibility or want to try Pro first.",
    tone: "monthly",
    features: [
      "Everything in Free",
      "Personalised roadmap score and competitiveness intel",
      "Custom roadmap based on your year and targets",
      "UCAT and interview performance tracker",
      "What-if optimisation engine",
      "Application strategy and school-ranking tool",
      "Scholarship and financial planning tracker",
      "Live deadline alerts and key date monitoring",
      "Command dashboard with weekly action priorities",
      "Priority support",
    ],
    note:
      "Best for students who want full access now, without committing to the full year yet.",
  },
  {
    name: "Pro Annual",
    subtitle:
      "The smartest option for serious applicants across the full cycle.",
    price: "$99.99",
    suffix: "/year",
    badge: "Best Value",
    planKey: "pro_annual",
    cta: "Choose Annual and Save",
    valueLabel: "Best for full-cycle applicants",
    savingsLine: "Save $19.89 per year • 2 months free vs monthly",
    commitmentLine:
      "Just $8.33 per month billed annually, with uninterrupted access across the application cycle.",
    tone: "annual",
    features: [
      "Everything in Pro Monthly",
      "Lowest effective price for the year",
      "Full access through the application cycle",
      "Best option for Year 12 and gap-year students",
      "Priority product updates as new tools launch",
      "Better value than paying month-to-month",
    ],
    annualBonus: [
      "Priority access to new beta tools",
      "Full-cycle continuity without monthly interruptions",
      "Best choice for serious applicants planning across the year",
    ],
    note:
      "This is the strongest choice if you know you want the platform throughout the application cycle.",
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getCardStyles(tone: Plan["tone"]) {
  if (tone === "annual") {
    return {
      card: "border-emerald-400 bg-linear-to-b from-emerald-50 to-white shadow-xl shadow-emerald-200/60 ring-2 ring-emerald-200 lg:-mt-3",
      iconWrap: "bg-white shadow-sm",
      icon: "text-emerald-600",
      price: "text-slate-950",
      button:
        "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed",
      featureIcon: "text-emerald-600",
      badge: "bg-slate-950 text-white",
      valueBox:
        "border-emerald-200 bg-emerald-100 text-emerald-900",
      savingsBox:
        "border-slate-900 bg-slate-950 text-white",
      consentBox: "border-emerald-200 bg-white/90",
      compareHeader: "border-emerald-300 bg-emerald-50",
    };
  }

  if (tone === "monthly") {
    return {
      card: "border-blue-300 bg-linear-to-b from-blue-50 to-white shadow-sm",
      iconWrap: "bg-white shadow-sm",
      icon: "text-blue-600",
      price: "text-slate-950",
      button:
        "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed",
      featureIcon: "text-emerald-600",
      badge: "bg-slate-950 text-white",
      valueBox:
        "border-blue-200 bg-blue-50 text-blue-900",
      savingsBox:
        "border-blue-200 bg-white text-slate-700",
      consentBox: "border-slate-200 bg-white/90",
      compareHeader: "border-blue-200 bg-blue-50",
    };
  }

  return {
    card: "border-slate-200 bg-white shadow-sm",
    iconWrap: "bg-white shadow-sm",
    icon: "text-slate-500",
    price: "text-slate-950",
    button:
      "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    featureIcon: "text-emerald-600",
    badge: "",
    valueBox:
      "border-slate-200 bg-slate-50 text-slate-700",
    savingsBox:
      "border-slate-200 bg-white text-slate-700",
    consentBox: "border-slate-200 bg-white/90",
    compareHeader: "border-slate-200 bg-slate-50",
  };
}

function PricingCard({
  plan,
  onCheckout,
  loadingPlan,
  isSignedIn,
  currentPlan,
}: {
  plan: Plan;
  onCheckout: (plan: "pro_monthly" | "pro_annual", accepted: boolean) => void;
  loadingPlan: string | null;
  isSignedIn: boolean;
  currentPlan: CurrentPlan;
}) {
  const isPaidPlan = !!plan.planKey;
  const isLoading = loadingPlan === plan.planKey;
  const [accepted, setAccepted] = useState(false);
  const styles = getCardStyles(plan.tone);

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
            ? plan.cta
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
        "relative rounded-3xl border p-6",
        styles.card
      )}
    >
      {plan.badge ? (
        <div
          className={cx(
            "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm",
            styles.badge
          )}
        >
          {plan.badge}
        </div>
      ) : null}

      <div className={cx("flex h-12 w-12 items-center justify-center rounded-2xl", styles.iconWrap)}>
        {plan.name === "Free" ? (
          <ShieldCheck className={cx("h-5 w-5", styles.icon)} />
        ) : plan.name === "Pro Monthly" ? (
          <Zap className={cx("h-5 w-5", styles.icon)} />
        ) : (
          <Crown className={cx("h-5 w-5", styles.icon)} />
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-2xl font-black tracking-tight text-slate-950">
          {plan.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{plan.subtitle}</p>
      </div>

      <div className="mt-5 flex items-end gap-1">
        <span className={cx("text-5xl font-black tracking-tight", styles.price)}>
          {plan.price}
        </span>
        <span className="pb-1 text-sm text-slate-500">{plan.suffix}</span>
      </div>

      <div className={cx("mt-4 rounded-2xl border px-4 py-3", styles.valueBox)}>
        <div className="text-sm font-semibold">{plan.valueLabel}</div>
        {plan.commitmentLine ? (
          <p className="mt-1 text-sm leading-6 opacity-90">{plan.commitmentLine}</p>
        ) : null}
      </div>

      {plan.savingsLine ? (
        <div className={cx("mt-3 rounded-2xl border px-4 py-3", styles.savingsBox)}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            <span>{plan.savingsLine}</span>
          </div>
        </div>
      ) : null}

      {isCurrentPlan ? (
        <div className="mt-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {isPaidPlan ? "Current Subscription" : "Current Plan"}
        </div>
      ) : null}

      {isPaidPlan ? (
        <>
          <div className={cx("mt-5 rounded-2xl border p-4 text-sm leading-6 text-slate-700", styles.consentBox)}>
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
              "mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition",
              styles.button
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
            styles.button
          )}
        >
          {buttonLabel}
        </Link>
      )}

      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className={cx("mt-0.5 h-4 w-4 shrink-0", styles.featureIcon)} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {plan.annualBonus?.length ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-900">
            Annual-only value stack
          </div>
          <ul className="mt-3 space-y-2 text-sm text-emerald-900">
            {plan.annualBonus.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {plan.note ? (
        <p className="mt-5 text-xs leading-5 text-slate-500">{plan.note}</p>
      ) : null}
    </motion.div>
  );
}

function ComparisonColumn({
  title,
  eyebrow,
  points,
  tone,
}: {
  title: string;
  eyebrow: string;
  points: string[];
  tone: "free" | "monthly" | "annual";
}) {
  const styles = getCardStyles(tone);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={cx("inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest", styles.compareHeader)}>
        {eyebrow}
      </div>
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-slate-700">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <Check className={cx("mt-0.5 h-4 w-4 shrink-0", styles.featureIcon)} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
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
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-emerald-50/30 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm">
            Beta Phase — Limited Access
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Choose the plan that gives you the full edge
          </h1>

          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            Free helps you explore. Pro Monthly unlocks the tools. Pro Annual is
            the smartest way to stay fully covered across the application cycle.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              Full-cycle access
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
              Save more with annual billing
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              Built for serious medicine applicants
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl rounded-3xl bg-slate-950 px-6 py-6 text-center text-white shadow-lg">
          <p className="text-sm font-bold uppercase tracking-widest text-white/85">
            Early Beta Access
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Aussie Med Guide is currently in early beta. Features are actively
            being built and improved. Early users are locking in access before
            the platform becomes more complete and more expensive later.
          </p>
        </div>

        {pageError ? (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {pageError}
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:items-start">
          <PricingCard
            plan={plans[0]}
            onCheckout={handleCheckout}
            loadingPlan={loadingPlan}
            isSignedIn={!!isSignedIn}
            currentPlan={currentPlan}
          />
          <PricingCard
            plan={plans[1]}
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

        <div className="mx-auto mt-14 max-w-6xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm">
              What’s included
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Why Annual should feel like the obvious choice
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              The difference is not just price. Annual gives you the strongest
              value, the lowest effective monthly cost, and uninterrupted access
              when the application cycle matters most.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ComparisonColumn
              title="Free"
              eyebrow="Preview"
              tone="free"
              points={[
                "Explore the platform and understand the pathway",
                "Browse key planning resources",
                "Compare universities and entry information",
                "Best for early-stage students still figuring things out",
              ]}
            />
            <ComparisonColumn
              title="Pro Monthly"
              eyebrow="Flexible access"
              tone="monthly"
              points={[
                "Unlock all premium tools immediately",
                "Best if you want to try Pro first",
                "Good for shorter-term flexibility",
                "A strong upgrade from Free",
              ]}
            />
            <ComparisonColumn
              title="Pro Annual"
              eyebrow="Best overall value"
              tone="annual"
              points={[
                "Everything in Pro Monthly",
                "Save $19.89 per year compared with monthly",
                "2 months free in effective value",
                "Best for Year 12 and gap-year applicants using the platform across the full cycle",
                "Priority access to new beta tools and updates",
              ]}
            />
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl rounded-3xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800">
                Recommendation
              </div>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                Most serious applicants should choose Pro Annual
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
                If you’re going to use Aussie Med Guide across the year, Annual
                is the strongest choice. It removes monthly friction, lowers the
                effective price, and keeps your tools, planning, and progress in
                one place through the cycle.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-white px-6 py-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-600">
                Annual effective monthly cost
              </div>
              <div className="mt-1 text-4xl font-black tracking-tight text-slate-950">
                $8.33
              </div>
              <div className="text-sm text-slate-500">per month billed yearly</div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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