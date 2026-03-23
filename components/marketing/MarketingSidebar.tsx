import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import type { ComponentType } from "react";
import ActiveNavLink from "@/components/marketing/ActiveNavLink";
import MobileSidebarShell from "@/components/marketing/MobileSidebarShell";

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

export const marketingSections: NavSection[] = [
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

function SidebarSections() {
  return (
    <div className="space-y-5">
      {marketingSections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => (
              <ActiveNavLink
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
          />
        </Link>
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
        <SidebarDisclaimer />
      </aside>
    </>
  );
}