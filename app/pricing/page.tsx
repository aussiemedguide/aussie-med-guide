import { auth, currentUser } from "@clerk/nextjs/server";
import { PricingFlow } from "@/components/pricing/pricing-flow";

export default async function PricingPage() {
  const { userId } = await auth();
  const user = await currentUser();

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
            One clean account. One clear plan. No messy billing logic.
          </p>
        </div>

        <PricingFlow
          isSignedIn={!!userId}
          userEmail={user?.emailAddresses?.[0]?.emailAddress ?? ""}
        />
      </section>
    </main>
  );
}