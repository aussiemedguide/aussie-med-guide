import { PricingCard } from "@/components/pricing/pricing-card";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            Pricing
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Choose your plan.
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Transparent pricing. Clear billing. No confusing surprises.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <PricingCard
            planName="Pro Monthly"
            priceLabel="$9.99 / month"
            plan="monthly"
          />

          <PricingCard
            planName="Pro Annual"
            priceLabel="$99.99 / year"
            plan = "annual"
          />
        </div>
      </section>
    </main>
  );
}