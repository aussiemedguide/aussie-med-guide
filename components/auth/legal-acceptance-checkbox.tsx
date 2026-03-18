"use client";

import Link from "next/link";

type LegalAcceptanceCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
};

export function LegalAcceptanceCheckbox({
  checked,
  onCheckedChange,
  error,
}: LegalAcceptanceCheckboxProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />

        <span>
          I agree to the{" "}
          <Link
            href="/legal/terms-of-use"
            className="font-semibold text-slate-900 underline underline-offset-4"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy-policy"
            className="font-semibold text-slate-900 underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          . I understand the platform also operates under the{" "}
          <Link
            href="/legal/educational-disclaimer"
            className="font-semibold text-slate-900 underline underline-offset-4"
          >
            Educational Disclaimer
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/payments-subscription-terms"
            className="font-semibold text-slate-900 underline underline-offset-4"
          >
            Payments & Subscription Terms
          </Link>
          .
        </span>
      </label>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}