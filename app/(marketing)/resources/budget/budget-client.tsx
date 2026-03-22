"use client";

import type { ComponentType, ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Building2,
  House,
  Plus,
  Trash2,
  Info,
  TriangleAlert,
  Check,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Lock,
} from "lucide-react";

type DurationOption =
  | "3 Months"
  | "6 Months"
  | "Academic Year (40 wks)"
  | "Full Year";

type ExtraCostItem = {
  id: string;
  label: string;
  value: number;
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function weeksForDuration(duration: DurationOption) {
  if (duration === "3 Months") return 13;
  if (duration === "6 Months") return 26;
  if (duration === "Full Year") return 52;
  return 40;
}

export default function BudgetClient({ isPremium }: { isPremium: boolean }) {
  const [duration, setDuration] =
    useState<DurationOption>("Academic Year (40 wks)");

  const [collegeWeeklyFee, setCollegeWeeklyFee] = useState(400);
  const [collegeExtras, setCollegeExtras] = useState<ExtraCostItem[]>([]);

  const [privateRent, setPrivateRent] = useState(250);
  const [privateUtilities, setPrivateUtilities] = useState(50);
  const [privateInternet, setPrivateInternet] = useState(20);
  const [privateTransport, setPrivateTransport] = useState(40);
  const [privateGroceries, setPrivateGroceries] = useState(100);
  const [privateEatingOut, setPrivateEatingOut] = useState(50);
  const [privateHousehold, setPrivateHousehold] = useState(30);
  const [privateExtras, setPrivateExtras] = useState<ExtraCostItem[]>([]);

  const weeks = weeksForDuration(duration);

  const collegeWeeklyTotal = useMemo(() => {
    const extrasTotal = collegeExtras.reduce((sum, item) => sum + item.value, 0);
    return collegeWeeklyFee + extrasTotal;
  }, [collegeWeeklyFee, collegeExtras]);

  const privateWeeklyTotal = useMemo(() => {
    const extrasTotal = privateExtras.reduce((sum, item) => sum + item.value, 0);
    return (
      privateRent +
      privateUtilities +
      privateInternet +
      privateTransport +
      privateGroceries +
      privateEatingOut +
      privateHousehold +
      extrasTotal
    );
  }, [
    privateRent,
    privateUtilities,
    privateInternet,
    privateTransport,
    privateGroceries,
    privateEatingOut,
    privateHousehold,
    privateExtras,
  ]);

  const collegeMonthly = useMemo(
    () => Math.round((collegeWeeklyTotal * 52) / 12),
    [collegeWeeklyTotal]
  );
  const privateMonthly = useMemo(
    () => Math.round((privateWeeklyTotal * 52) / 12),
    [privateWeeklyTotal]
  );

  const collegePeriodTotal = collegeWeeklyTotal * weeks;
  const privatePeriodTotal = privateWeeklyTotal * weeks;
  const difference = Math.abs(collegePeriodTotal - privatePeriodTotal);
  const cheaperSide =
    collegePeriodTotal < privatePeriodTotal
      ? "College"
      : privatePeriodTotal < collegePeriodTotal
        ? "Private"
        : "Equal";

  function addCollegeExtra() {
    setCollegeExtras((prev) => [
      ...prev,
      {
        id: makeId(),
        label: "",
        value: 0,
      },
    ]);
  }

  function updateCollegeExtra(
    id: string,
    field: "label" | "value",
    value: string | number
  ) {
    setCollegeExtras((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === "value") {
          return { ...item, value: Number(value) || 0 };
        }
        return { ...item, label: String(value) };
      })
    );
  }

  function removeCollegeExtra(id: string) {
    setCollegeExtras((prev) => prev.filter((item) => item.id !== id));
  }

  function addPrivateExtra() {
    setPrivateExtras((prev) => [
      ...prev,
      {
        id: makeId(),
        label: "",
        value: 0,
      },
    ]);
  }

  function updatePrivateExtra(
    id: string,
    field: "label" | "value",
    value: string | number
  ) {
    setPrivateExtras((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === "value") {
          return { ...item, value: Number(value) || 0 };
        }
        return { ...item, label: String(value) };
      })
    );
  }

  function removePrivateExtra(id: string) {
    setPrivateExtras((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <FeatureGate
      locked={!isPremium}
      title="Upgrade to unlock Budget Planner"
      description="Compare college vs private living costs with full customisation and realistic budgeting tools."
      ctaHref="/info/pricing"
      ctaLabel="Upgrade to Pro"
      previewLabel="Budget Planner"
    >
      <main className="min-h-screen bg-[#eef3f8] text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              <span className="text-emerald-500">Resources</span>
              <span>•</span>
              <span>Budget Planner</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
              <Sparkles className="h-4 w-4" />
              Compare college vs private living
            </div>
          </div>

          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/75 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-400 via-sky-500 to-violet-400" />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/60">
                    <Calculator className="h-7 w-7" />
                  </div>

                  <div>
                    <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                      Budget Planner
                    </h1>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                      Compare college living vs private living costs for med
                      students and customise both sides with your own extra
                      expenses.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-sm rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-cyan-50 p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <Info className="h-4 w-4" />
                  Flexible budgeting
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  You can add custom items on both sides, so this works whether
                  you want a simple estimate or a more realistic personal budget.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <section className="rounded-3xl border border-blue-200 bg-white/80 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.03em] text-slate-950">
                    College Living
                  </h2>
                </div>
              </div>

              <NumberInput
                label="Weekly College Fee"
                value={collegeWeeklyFee}
                onChange={setCollegeWeeklyFee}
              />

              <p className="mt-2 text-xs text-slate-500">
                Typically includes accommodation, meals, utilities, internet
              </p>

              <div className="mt-5 rounded-3xl bg-blue-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Usually Included:
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    "Accommodation",
                    "All meals (breakfast, lunch, dinner)",
                    "Utilities (electricity, water, gas)",
                    "Internet and WiFi",
                    "Cleaning of common areas",
                    "Social events and activities",
                    "Academic support programs",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-blue-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Add College Extras
                    </p>
                    <p className="text-xs text-slate-500">
                      Add anything not covered in the base fee
                    </p>
                  </div>

                  <button
                    onClick={addCollegeExtra}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add item
                  </button>
                </div>

                {collegeExtras.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                    No extra college costs added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {collegeExtras.map((item) => (
                      <ExtraItemRow
                        key={item.id}
                        label={item.label}
                        value={item.value}
                        onLabelChange={(value) =>
                          updateCollegeExtra(item.id, "label", value)
                        }
                        onValueChange={(value) =>
                          updateCollegeExtra(item.id, "value", value)
                        }
                        onRemove={() => removeCollegeExtra(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-base text-slate-600">Monthly Cost:</p>
                </div>
                <p className="text-2xl font-black tracking-[-0.04em] text-blue-600">
                  {formatCurrency(collegeMonthly)}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-200 bg-white/80 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <House className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.03em] text-slate-950">
                    Private Living
                  </h2>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <span className="font-semibold">Tip:</span> You can choose
                different furnishing types or budget styles. Unfurnished options
                are often cheaper, but extras can build up.
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Fixed Weekly Costs
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <NumberInput
                    label="Rent"
                    value={privateRent}
                    onChange={setPrivateRent}
                  />
                  <NumberInput
                    label="Utilities"
                    value={privateUtilities}
                    onChange={setPrivateUtilities}
                  />
                  <NumberInput
                    label="Internet"
                    value={privateInternet}
                    onChange={setPrivateInternet}
                  />
                  <NumberInput
                    label="Transport"
                    value={privateTransport}
                    onChange={setPrivateTransport}
                  />
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Variable Weekly Costs
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <NumberInput
                    label="Groceries"
                    value={privateGroceries}
                    onChange={setPrivateGroceries}
                  />
                  <NumberInput
                    label="Eating out / coffee"
                    value={privateEatingOut}
                    onChange={setPrivateEatingOut}
                  />
                  <div className="md:col-span-2">
                    <NumberInput
                      label="Household supplies"
                      value={privateHousehold}
                      onChange={setPrivateHousehold}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Add Private Living Extras
                    </p>
                    <p className="text-xs text-slate-500">
                      Add anything extra like gym, subscriptions, parking,
                      laundry, furnishing
                    </p>
                  </div>

                  <button
                    onClick={addPrivateExtra}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add item
                  </button>
                </div>

                {privateExtras.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                    No extra private costs added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {privateExtras.map((item) => (
                      <ExtraItemRow
                        key={item.id}
                        label={item.label}
                        value={item.value}
                        onLabelChange={(value) =>
                          updatePrivateExtra(item.id, "label", value)
                        }
                        onValueChange={(value) =>
                          updatePrivateExtra(item.id, "value", value)
                        }
                        onRemove={() => removePrivateExtra(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-base text-slate-600">Monthly Cost:</p>
                </div>
                <p className="text-2xl font-black tracking-[-0.04em] text-emerald-600">
                  {formatCurrency(privateMonthly)}
                </p>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.03em] text-slate-950">
                  Cost Comparison
                </h2>
              </div>

              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as DurationOption)}
                  className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-300"
                >
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>Academic Year (40 wks)</option>
                  <option>Full Year</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr_1fr]">
              <SummaryCard
                title="College Living"
                value={formatCurrency(collegePeriodTotal)}
                subtitle={`${weeks} weeks`}
                tone="blue"
                icon={Building2}
              />

              <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                <ArrowRight className="h-7 w-7 text-slate-400" />
                <p className="mt-4 text-sm text-slate-500">
                  {cheaperSide === "Equal"
                    ? "Both options currently cost the same"
                    : `${cheaperSide} is cheaper by`}
                </p>
                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-blue-600">
                  {formatCurrency(difference)}
                </p>
              </div>

              <SummaryCard
                title="Private Living"
                value={formatCurrency(privatePeriodTotal)}
                subtitle={`${weeks} weeks`}
                tone="green"
                icon={House}
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  College Living Pros
                </h3>
                <div className="mt-3 space-y-2">
                  {[
                    "All inclusive, no surprise costs",
                    "Built in community and social life",
                    "Academic support and tutoring",
                    "No cooking or cleaning required",
                    "Closer transition support in first year",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-emerald-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-950">
                  Private Living Pros
                </h3>
                <div className="mt-3 space-y-2">
                  {[
                    "More independence and privacy",
                    "Can be cheaper overall depending on setup",
                    "Choose your own food and diet",
                    "More flexibility with location",
                    "Good for building life skills",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-emerald-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
            <p className="text-sm leading-6 text-emerald-900">
              <span className="font-semibold">Tip:</span> First year med
              students often benefit from college living due to the built-in
              community and transition support. Many switch to private
              accommodation in later years.
            </p>
          </section>

          <section className="mt-4 rounded-3xl border border-amber-300 bg-amber-50/70 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                <span className="font-semibold">Disclaimer:</span> These are
                estimates only. I am not responsible for any decisions made
                based on this information. Always verify actual costs with
                colleges and accommodation providers.
              </p>
            </div>
          </section>
        </div>
      </main>
    </FeatureGate>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-3">
        <span className="mr-2 text-sm text-slate-400">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent text-sm text-slate-800 outline-none"
        />
      </div>
    </div>
  );
}

function ExtraItemRow({
  label,
  value,
  onLabelChange,
  onValueChange,
  onRemove,
}: {
  label: string;
  value: number;
  onLabelChange: (value: string) => void;
  onValueChange: (value: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
      <div>
        <input
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Extra item name"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-sky-300"
        />
      </div>

      <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-3">
        <span className="mr-2 text-sm text-slate-400">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent text-sm text-slate-800 outline-none"
        />
      </div>

      <button
        onClick={onRemove}
        className="inline-flex h-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-700 transition hover:bg-rose-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  tone,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  tone: "blue" | "green";
  icon: ComponentType<{ className?: string }>;
}) {
  const toneClasses =
    tone === "blue"
      ? "border-blue-200 bg-blue-50/70 text-blue-700"
      : "border-emerald-200 bg-emerald-50/70 text-emerald-700";

  return (
    <div className={cn("rounded-3xl border p-6 text-center", toneClasses)}>
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-4 text-base font-semibold">{title}</p>
      <p className="mt-2 text-4xl font-black tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-sm opacity-80">{subtitle}</p>
    </div>
  );
}

function FeatureGate({
  locked,
  title,
  description,
  ctaHref,
  ctaLabel,
  previewLabel,
  children,
}: {
  locked: boolean;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  previewLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="relative">
      <div
        className={cn(
          "transition",
          locked ? "pointer-events-none select-none blur-md opacity-40" : ""
        )}
      >
        {children}
      </div>

      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <Lock className="mx-auto mb-3 h-6 w-6 text-slate-700" />
            <p className="text-xs uppercase tracking-widest text-slate-500">
              {previewLabel}
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>

            <Link
              href={ctaHref}
              className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-white"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}