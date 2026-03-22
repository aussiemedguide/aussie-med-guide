"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  Home,
  Crown,
  Globe,
  Fingerprint,
  Route,
  GraduationCap,
  FileText,
  CalendarDays,
  BarChart3,
  Trophy,
  Search,
  Briefcase,
  BadgeDollarSign,
  Building2,
  Calculator,
  Target,
  BookOpen,
  Brain,
  TrendingUp,
  HeartPulse,
  Activity,
  CircleDollarSign,
  UserRound,
  Menu,
  X,
} from "lucide-react";

type NavLinkItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type NavSection = {
  title: string;
  items: NavLinkItem[];
};

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function NavItem({
  href,
  label,
  icon: Icon,
  active = false,
  onClick,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cx(
        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-700 hover:bg-slate-100"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SidebarSections({
  pathname,
  onItemClick,
}: {
  pathname: string;
  onItemClick?: () => void;
}) {
  const isActive = (href: string) => pathname === href;

  const sections: NavSection[] = [
    {
      title: "Main",
      items: [{ href: "/", label: "Home", icon: Home }],
    },
    {
      title: "Blueprint",
      items: [
        { href: "/blueprint/parent", label: "Parent Blueprint", icon: Crown },
        {
          href: "/blueprint/international",
          label: "International Blueprint",
          icon: Globe,
        },
      ],
    },
    {
      title: "Explore",
      items: [
        {
          href: "/explore/student-classification",
          label: "Student Classification",
          icon: Fingerprint,
        },
        { href: "/explore/pathway", label: "Pathway", icon: Route },
        {
          href: "/explore/medical-schools",
          label: "Medical Schools",
          icon: GraduationCap,
        },
        {
          href: "/explore/application-systems",
          label: "Application Systems",
          icon: FileText,
        },
        {
          href: "/explore/offers-selection",
          label: "Offers & Selection",
          icon: CalendarDays,
        },
        {
          href: "/explore/statistics",
          label: "Statistics",
          icon: BarChart3,
        },
        { href: "/explore/rankings", label: "Rankings", icon: Trophy },
        {
          href: "/explore/choose-your-uni",
          label: "Choose Your Uni",
          icon: Search,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          href: "/resources/opportunities",
          label: "Opportunities",
          icon: Briefcase,
        },
        {
          href: "/resources/scholarships",
          label: "Scholarships",
          icon: BadgeDollarSign,
        },
        {
          href: "/resources/accommodation",
          label: "Accommodation",
          icon: Building2,
        },
        { href: "/resources/budget", label: "Budget", icon: Calculator },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          href: "/tools/strategy-hub",
          label: "Strategy Hub",
          icon: Target,
        },
        {
          href: "/tools/study-engine",
          label: "Study Engine",
          icon: BookOpen,
        },
        { href: "/tools/train", label: "Train", icon: Brain },
        {
          href: "/tools/optimise",
          label: "Optimise",
          icon: TrendingUp,
        },
        {
          href: "/tools/resilience",
          label: "Resilience",
          icon: HeartPulse,
        },
        { href: "/tools/command", label: "Command", icon: Activity },
      ],
    },
    {
      title: "Info",
      items: [
        {
          href: "/info/pricing",
          label: "Pricing",
          icon: CircleDollarSign,
        },
        { href: "/info/about", label: "About", icon: UserRound },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="border-b border-slate-200 pb-6">
      <div className="flex justify-center">
        <Link
          href="/"
          className={cx(
            "group block overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5 transition hover:shadow-md",
            compact ? "w-36" : "w-52"
          )}
          aria-label="Go to Aussie Med Guide home"
        >
          <Image
            src="/images/logo/amg-logo.png"
            alt="Aussie Med Guide logo"
            width={220}
            height={220}
            className="h-full w-full object-cover transition group-hover:scale-105"
            priority
          />
        </Link>
      </div>
    </div>
  );
}

export default function MarketingSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "";
    }

    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
            <Image
              src="/images/logo/amg-logo.png"
              alt="Aussie Med Guide logo"
              width={44}
              height={44}
              className="h-11 w-11 object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              Aussie Med Guide
            </p>
            <p className="truncate text-xs text-slate-500">
              Medicine Entry Resource Hub
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
        />
      ) : null}

      {/* Mobile drawer */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-xs flex-col border-r border-slate-200 bg-slate-50 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
              <Image
                src="/images/logo/amg-logo.png"
                alt="Aussie Med Guide logo"
                width={44}
                height={44}
                className="h-11 w-11 object-cover"
                priority
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                Aussie Med Guide
              </p>
              <p className="truncate text-xs text-slate-500">Navigation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <SidebarSections
            pathname={pathname}
            onItemClick={() => setMobileOpen(false)}
          />

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Disclaimer</p>
            <p className="mt-2 leading-5">
              This guide is for informational purposes only. Always verify
              details with official university sources.
            </p>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 px-4 py-5 lg:block">
        <div className="mb-6">
          <SidebarBrand />
        </div>

        <SidebarSections pathname={pathname} />

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">Disclaimer</p>
          <p className="mt-2 leading-5">
            This guide is for informational purposes only. Always verify details
            with official university sources.
          </p>
        </div>
      </aside>
    </>
  );
}