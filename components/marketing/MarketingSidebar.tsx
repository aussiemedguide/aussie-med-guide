"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { Crown, LogOut, Settings } from "lucide-react";

import type { NavIconKey } from "@/components/marketing/ActiveNavLink";
import DesktopNavLink from "@/components/marketing/DesktopNavLink";
import MobileSidebarShell from "@/components/marketing/MobileSidebarShell";

type NavLinkItem = {
  href: string;
  label: string;
  icon: NavIconKey;
};

type NavSection = {
  title: string;
  items: NavLinkItem[];
};

type PlanResponse = {
  isSignedIn: boolean;
  isPro: boolean;
  plan: string;
  status: string | null;
};

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const marketingSections: NavSection[] = [
  {
    title: "Main",
    items: [{ href: "/", label: "Home", icon: "home" }],
  },
  {
    title: "Blueprint",
    items: [
      { href: "/blueprint/parent", label: "Parent Blueprint", icon: "crown" },
      {
        href: "/blueprint/international",
        label: "International Blueprint",
        icon: "globe",
      },
    ],
  },
  {
    title: "Explore",
    items: [
      {
        href: "/explore/student-classification",
        label: "Student Classification",
        icon: "fingerprint",
      },
      { href: "/explore/pathway", label: "Pathway", icon: "route" },
      {
        href: "/explore/medical-schools",
        label: "Medical Schools",
        icon: "graduation-cap",
      },
      {
        href: "/explore/application-systems",
        label: "Application Systems",
        icon: "file-text",
      },
      {
        href: "/explore/offers-selection",
        label: "Offers & Selection",
        icon: "calendar-days",
      },
      {
        href: "/explore/statistics",
        label: "Statistics",
        icon: "bar-chart-3",
      },
      { href: "/explore/rankings", label: "Rankings", icon: "trophy" },
      {
        href: "/explore/choose-your-uni",
        label: "Choose Your Uni",
        icon: "search",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        href: "/resources/opportunities",
        label: "Opportunities",
        icon: "briefcase",
      },
      {
        href: "/resources/scholarships",
        label: "Scholarships",
        icon: "badge-dollar-sign",
      },
      {
        href: "/resources/accommodation",
        label: "Accommodation",
        icon: "building-2",
      },
      { href: "/resources/budget", label: "Budget", icon: "calculator" },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        href: "/tools/strategy-hub",
        label: "Strategy Hub",
        icon: "target",
      },
      {
        href: "/tools/study-engine",
        label: "Study Engine",
        icon: "book-open",
      },
      { href: "/tools/train", label: "Train", icon: "brain" },
      {
        href: "/tools/optimise",
        label: "Optimise",
        icon: "trending-up",
      },
      {
        href: "/tools/resilience",
        label: "Resilience",
        icon: "heart-pulse",
      },
      { href: "/tools/command", label: "Command", icon: "activity" },
    ],
  },
  {
    title: "Info",
    items: [
      {
        href: "/info/pricing",
        label: "Pricing",
        icon: "circle-dollar-sign",
      },
      { href: "/info/about", label: "About", icon: "user-round" },
    ],
  },
];

function SidebarSections() {
  return (
    <div className="space-y-5">
      {marketingSections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {section.title}
          </p>

          <div className="space-y-1">
            {section.items.map((item) => (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarBrand() {
  return (
    <div className="border-b border-slate-200 pb-6">
      <div className="flex justify-center">
        <Link
          href="/"
          className="group flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-emerald-800/10 bg-emerald-700 shadow-sm"
        >
          <Image
            src="/images/logo/amg-logo.svg"
            alt="Aussie Med Guide logo"
            width={72}
            height={72}
            className="h-full w-full object-contain scale-125"
            priority
          />
        </Link>
      </div>
    </div>
  );
}

function SidebarAccount() {
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const [planData, setPlanData] = useState<PlanResponse | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;

    async function loadPlan() {
      try {
        setLoadingPlan(true);
        const res = await fetch("/api/me/plan", { cache: "no-store" });
        const json: PlanResponse = await res.json();

        if (!cancelled) {
          setPlanData(json);
        }
      } catch {
        if (!cancelled) {
          setPlanData({
            isSignedIn: true,
            isPro: false,
            plan: "free",
            status: null,
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingPlan(false);
        }
      }
    }

    loadPlan();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  if (!isSignedIn || !user) return null;

  const isPro = planData?.isPro ?? false;

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        Account
      </p>

      <div className="rounded-2xl bg-slate-50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">
            {user.fullName ?? user.firstName ?? "Account"}
          </p>

          <span
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
              isPro
                ? "border border-amber-200 bg-amber-50 text-amber-700"
                : "border border-slate-200 bg-white text-slate-600"
            )}
          >
            {isPro ? (
              <>
                <Crown className="h-3 w-3" />
                Pro
              </>
            ) : loadingPlan ? (
              "Checking..."
            ) : (
              "Free"
            )}
          </span>
        </div>

        <p className="mt-1 truncate text-xs text-slate-500">
          {user.primaryEmailAddress?.emailAddress}
        </p>
      </div>

      <div className="mt-3 space-y-1">
        <Link
          href="/profile"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Settings className="h-4 w-4" />
          Manage profile
        </Link>

        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function SidebarDisclaimer() {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
      <p className="font-semibold text-slate-700">Disclaimer</p>
      <p className="mt-2 leading-5">
        This guide is for informational purposes only. Always verify details
        with official university sources.
      </p>
    </div>
  );
}

export default function MarketingSidebar() {
  return (
    <>
      <MobileSidebarShell sections={marketingSections} />

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 px-4 py-5 lg:block">
        <div className="mb-6">
          <SidebarBrand />
        </div>

        <SidebarSections />
        <SidebarAccount />
        <SidebarDisclaimer />
      </aside>
    </>
  );
}