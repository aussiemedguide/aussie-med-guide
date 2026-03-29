"use client";

import Image from "next/image";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

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
  const { user } = useUser();

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        Account
      </p>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          {user?.firstName?.[0] ?? "A"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {user?.firstName ?? "Account"}
          </p>
          <p className="truncate text-xs text-slate-500">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      <button
        onClick={() => signOut()}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}

function SidebarDisclaimer() {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
      <p className="font-semibold text-slate-700">Disclaimer</p>

      <p className="mt-2 leading-5">
        This guide is for informational purposes only.
        Always verify details with official university sources.
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