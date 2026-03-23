"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export type NavIconKey =
  | "home"
  | "crown"
  | "globe"
  | "fingerprint"
  | "route"
  | "graduation-cap"
  | "file-text"
  | "calendar-days"
  | "bar-chart-3"
  | "trophy"
  | "search"
  | "briefcase"
  | "badge-dollar-sign"
  | "building-2"
  | "calculator"
  | "target"
  | "book-open"
  | "brain"
  | "trending-up"
  | "heart-pulse"
  | "activity"
  | "circle-dollar-sign"
  | "user-round";

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getIcon(icon: NavIconKey) {
  switch (icon) {
    case "home":
      return Home;
    case "crown":
      return Crown;
    case "globe":
      return Globe;
    case "fingerprint":
      return Fingerprint;
    case "route":
      return Route;
    case "graduation-cap":
      return GraduationCap;
    case "file-text":
      return FileText;
    case "calendar-days":
      return CalendarDays;
    case "bar-chart-3":
      return BarChart3;
    case "trophy":
      return Trophy;
    case "search":
      return Search;
    case "briefcase":
      return Briefcase;
    case "badge-dollar-sign":
      return BadgeDollarSign;
    case "building-2":
      return Building2;
    case "calculator":
      return Calculator;
    case "target":
      return Target;
    case "book-open":
      return BookOpen;
    case "brain":
      return Brain;
    case "trending-up":
      return TrendingUp;
    case "heart-pulse":
      return HeartPulse;
    case "activity":
      return Activity;
    case "circle-dollar-sign":
      return CircleDollarSign;
    case "user-round":
      return UserRound;
  }
}

export default function ActiveNavLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: NavIconKey;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);
  const Icon = getIcon(icon);

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
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}