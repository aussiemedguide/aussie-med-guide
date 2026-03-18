"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
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
  Compass,
  CircleDollarSign,
  UserRound,
} from "lucide-react";

function NavItem({
  href,
  label,
  icon: Icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export default function MarketingSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

return (
  <aside className="sticky top-0 hidden h-screen w-72.5 shrink-0 overflow-y-auto border-r border-[#E7EAF0] bg-[#F7F8FA] px-4 py-5 lg:block">
    <div className="mb-6 border-b border-[#E7EAF0] pb-6">
      <div className="flex justify-center">
        <Link
          href="/"
          className="group block w-52 overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
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

      <div className="space-y-5">
        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Main
          </p>
          <div className="space-y-1">
            <NavItem href="/" label="Home" icon={Home} active={isActive("/")} />
          </div>
        </div>

        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Blueprint
          </p>
          <div className="space-y-1">
            <NavItem
              href="/blueprint/parent"
              label="Parent Blueprint"
              icon={Crown}
              active={isActive("/blueprint/parent")}
            />
            <NavItem
              href="/blueprint/international"
              label="International Blueprint"
              icon={Globe}
              active={isActive("/blueprint/international")}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Explore
          </p>
          <div className="space-y-1">
            <NavItem
              href="/explore/student-classification"
              label="Student Classification"
              icon={Fingerprint}
              active={isActive("/explore/student-classification")}
            />
            <NavItem
              href="/explore/pathway"
              label="Pathway"
              icon={Route}
              active={isActive("/explore/pathway")}
            />
            <NavItem
              href="/explore/medical-schools"
              label="Medical Schools"
              icon={GraduationCap}
              active={isActive("/explore/medical-schools")}
            />
            <NavItem
              href="/explore/application-systems"
              label="Application Systems"
              icon={FileText}
              active={isActive("/explore/application-systems")}
            />
            <NavItem
              href="/explore/offers-selection"
              label="Offers & Selection"
              icon={CalendarDays}
              active={isActive("/explore/offers-selection")}
            />
            <NavItem
              href="/explore/statistics"
              label="Statistics"
              icon={BarChart3}
              active={isActive("/explore/statistics")}
            />
            <NavItem
              href="/explore/rankings"
              label="Rankings"
              icon={Trophy}
              active={isActive("/explore/rankings")}
            />
            <NavItem
              href="/explore/choose-your-uni"
              label="Choose Your Uni"
              icon={Search}
              active={isActive("/explore/choose-your-uni")}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Resources
          </p>
          <div className="space-y-1">
            <NavItem
              href="/resources/opportunities"
              label="Opportunities"
              icon={Briefcase}
              active={isActive("/resources/opportunities")}
            />
            <NavItem
              href="/resources/scholarships"
              label="Scholarships"
              icon={BadgeDollarSign}
              active={isActive("/resources/scholarships")}
            />
            <NavItem
              href="/resources/accommodation"
              label="Accommodation"
              icon={Building2}
              active={isActive("/resources/accommodation")}
            />
            <NavItem
              href="/resources/budget"
              label="Budget"
              icon={Calculator}
              active={isActive("/resources/budget")}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Tools
          </p>
          <div className="space-y-1">
            <NavItem
              href="/tools/strategy-hub"
              label="Strategy Hub"
              icon={Target}
              active={isActive("/tools/strategy-hub")}
            />
            <NavItem
              href="/tools/study-engine"
              label="Study Engine"
              icon={BookOpen}
              active={isActive("/tools/study-engine")}
            />
            <NavItem
              href="/tools/train"
              label="Train"
              icon={Brain}
              active={isActive("/tools/train")}
            />
            <NavItem
              href="/tools/optimise"
              label="Optimise"
              icon={TrendingUp}
              active={isActive("/tools/optimise")}
            />
            <NavItem
              href="/tools/resilience"
              label="Resilience"
              icon={HeartPulse}
              active={isActive("/tools/resilience")}
            />
            <NavItem
              href="/tools/command"
              label="Command"
              icon={Activity}
              active={isActive("/tools/command")}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Info
          </p>
          <div className="space-y-1">
            <NavItem
              href="/info/pricing"
              label="Pricing"
              icon={CircleDollarSign}
              active={isActive("/info/pricing")}
            />
            <NavItem
              href="/info/about"
              label="About"
              icon={UserRound}
              active={isActive("/info/about")}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E3E8EE] bg-white p-4 text-xs text-[#64748B]">
        <p className="font-semibold text-[#475569]">Disclaimer</p>
        <p className="mt-2 leading-5">
          This guide is for informational purposes only. Always verify details
          with official university sources.
        </p>
      </div>
    </aside>
  );
}