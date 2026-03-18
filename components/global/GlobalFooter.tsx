import Link from "next/link";

export default function GlobalFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-6 py-10 md:grid-cols-3 lg:px-10">
        <div>
          <h3 className="text-lg font-semibold">Aussie Med Guide</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
            Your comprehensive guide to navigating Australian medical school
            admissions.
          </p>
          <p className="mt-3 max-w-sm text-xs leading-5 text-slate-400">
            Independent educational platform. Not affiliated with universities,
            TACs, or UCAT ANZ.
          </p>
          <p className="mt-4 text-xs text-slate-400">© 2026 Aussie Med Guide</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <Link
                href="/legal"
                className="transition hover:text-white hover:underline"
              >
                Legal Hub
              </Link>
            </li>
            <li>
              <Link
                href="/legal/privacy-policy"
                className="transition hover:text-white hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms-of-use"
                className="transition hover:text-white hover:underline"
              >
                Terms of Use
              </Link>
            </li>
            <li>
              <Link
                href="/legal/educational-disclaimer"
                className="transition hover:text-white hover:underline"
              >
                Educational Disclaimer
              </Link>
            </li>
            <li>
              <Link
                href="/legal/payments-subscription-terms"
                className="transition hover:text-white hover:underline"
              >
                Payments & Subscription Terms
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Support</h3>
          <p className="mt-3 text-sm text-slate-300">
            Questions, billing issues, or privacy requests?
          </p>
          <a
            href="mailto:support@aussiemedguide.com"
            className="mt-2 inline-block text-sm text-slate-200 underline underline-offset-4 transition hover:text-white"
          >
            support@aussiemedguide.com
          </a>
        </div>
      </div>
    </footer>
  );
}