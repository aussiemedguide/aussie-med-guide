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
import type { NavIconKey } from "@/components/marketing/ActiveNavLink";

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
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

export default function DesktopNavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: NavIconKey;
}) {
  const Icon = getIcon(icon);

  return (
    <Link
      href={href}
      className={cx(
        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}