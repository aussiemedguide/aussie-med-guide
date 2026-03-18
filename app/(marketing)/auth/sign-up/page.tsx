import Link from "next/link";
import { ArrowLeft, Chrome, Crown, Zap } from "lucide-react";

type SearchParams = Promise<{
  plan?: string;
}>;

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "annual") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
        <Crown className="h-3.5 w-3.5" />
        Pro Annual Selected
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
      <Zap className="h-3.5 w-3.5" />
      Pro Monthly Selected
    </div>
  );
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedPlan = params?.plan === "annual" ? "annual" : "monthly";

  return (
    <div className="bg-slate-50 px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/info/pricing"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pricing
        </Link>

        <div className="mt-6 rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <PlanBadge plan={selectedPlan} />

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Create your account first
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Before subscribing, you’ll need an account so your plan, access,
              and future saved progress can be tied to you properly.
            </p>
          </div>

          <div className="mt-10 rounded-3xl bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              What happens next
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  1
                </div>
                <p>Create your account using Google.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  2
                </div>
                <p>
                  We’ll keep your selected plan as{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedPlan === "annual" ? "Pro Annual" : "Pro Monthly"}
                  </span>
                  .
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  3
                </div>
                <p>After sign-up, you’ll continue to checkout.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              type="button"
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </button>

            <Link
              href={`/checkout?plan=${selectedPlan}`}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Continue for now with placeholder flow
            </Link>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-slate-500">
            Google sign-in will be connected through Supabase later. For now,
            this page sets up the correct flow and selected plan.
          </p>
        </div>
      </div>
    </div>
  );
}