import Link from "next/link";

const legalLinks = [
  { href: "/legal", label: "Legal Hub" },
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/terms-of-use", label: "Terms of Use" },
  { href: "/legal/educational-disclaimer", label: "Educational Disclaimer" },
  {
    href: "/legal/payments-subscription-terms",
    label: "Payments & Subscription Terms",
  },
];

const supportLinks = [
  { href: "/info/about", label: "About Aussie Med Guide" },
  { href: "/info/pricing", label: "Pricing" },
];

export default function GlobalFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              Aussie Med Guide
            </div>

            <h3 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Your guide to Australian medical entry.
            </h3>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              Clear, structured support for navigating Australian medical school
              admissions, from pathways and requirements to scholarships,
              planning, and strategy.
            </p>

            <p className="mt-4 max-w-md text-xs leading-6 text-slate-400 sm:text-sm">
              Independent educational platform. Not affiliated with universities,
              TACs, or UCAT ANZ.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
              Legal
            </h4>

            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
              Support
            </h4>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Questions, billing issues, feedback, or privacy requests?
            </p>

            <a
              href="mailto:aussiemedguide@gmail.com"
              className="mt-4 inline-flex rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800"
            >
              aussiemedguide@gmail.com
            </a>

            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Aussie Med Guide. All rights reserved.</p>
          <p>Built for aspiring doctors across Australia.</p>
        </div>
      </div>
    </footer>
  );
}