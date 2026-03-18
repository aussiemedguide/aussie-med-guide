import Link from "next/link";

export function FooterLegalLinks() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
      <Link href="/legal" className="transition hover:text-slate-900">
        Legal
      </Link>
      <Link
        href="/legal/privacy-policy"
        className="transition hover:text-slate-900"
      >
        Privacy Policy
      </Link>
      <Link
        href="/legal/terms-of-use"
        className="transition hover:text-slate-900"
      >
        Terms of Use
      </Link>
      <Link
        href="/legal/educational-disclaimer"
        className="transition hover:text-slate-900"
      >
        Educational Disclaimer
      </Link>
      <Link
        href="/legal/payments-subscription-terms"
        className="transition hover:text-slate-900"
      >
        Payments
      </Link>
    </div>
  );
}