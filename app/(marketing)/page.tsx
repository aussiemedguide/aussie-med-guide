import type { ReactNode } from "react";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  CalendarDays,
  Compass,
  Crown,
  DollarSign,
  Globe,
  GraduationCap,
  HeartHandshake,
  LineChart,
  ListChecks,
  Map,
  Calculator,
  Search,
  Sparkles,
  Stethoscope,
  Target,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const dynamic = "force-static";

const RoadmapSectionHome = dynamicImport(
  () => import("@/components/marketing/RoadmapSectionHome"),
  {
    loading: () => (
      <section className="mb-10 sm:mb-12">
        <div className="overflow-hidden rounded-3xl bg-emerald-700 px-5 py-7 text-white shadow-sm sm:bg-linear-to-br sm:from-emerald-800 sm:via-emerald-700 sm:to-emerald-600 sm:px-8 sm:py-12 sm:shadow-[0_25px_70px_rgba(16,185,129,0.35)] lg:px-10 lg:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto h-8 w-32 rounded-full bg-emerald-100" />
            <div className="mx-auto mt-4 h-10 w-80 max-w-full rounded bg-slate-100" />
            <div className="mx-auto mt-3 h-4 w-full max-w-3xl rounded bg-slate-100" />
          </div>
        </div>
      </section>
    ),
  }
);

type CardItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  badge?: string;
};

const blueprintCards: CardItem[] = [
  {
    title: "Parent Blueprint",
    description: "Clarity, structure and financial guidance.",
    href: "/blueprint/parent",
    icon: Crown,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "International Blueprint",
    description: "ISAT, global pathways and Monash IMG.",
    href: "/blueprint/international",
    icon: Globe,
    color: "from-sky-500 to-blue-500",
  },
];

const exploreCards: CardItem[] = [
  {
    title: "Student Classification",
    description: "Rural, metro & international.",
    href: "/explore/student-classification",
    icon: Users,
    color: "from-cyan-500 to-teal-500",
  },
  {
    title: "Pathway",
    description: "ATAR, UCAT & interview guide.",
    href: "/explore/pathway",
    icon: Compass,
    color: "from-sky-500 to-cyan-500",
  },
  {
    title: "Medical Schools",
    description: "Compare all Australian programs.",
    href: "/explore/medical-schools",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Application Systems",
    description: "TAC systems & preferences.",
    href: "/explore/application-systems",
    icon: ListChecks,
    color: "from-blue-500 to-sky-500",
  },
  {
    title: "Offers & Selection",
    description: "UCAT dates & offer rounds.",
    href: "/explore/offers-selection",
    icon: CalendarDays,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Statistics",
    description: "Entry data and trends.",
    href: "/explore/statistics",
    icon: LineChart,
    color: "from-violet-500 to-indigo-500",
  },
  {
    title: "Rankings",
    description: "University rankings explained.",
    href: "/explore/rankings",
    icon: Trophy,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Choose Your Uni",
    description: "All info in one place.",
    href: "/explore/choose-your-uni",
    icon: Search,
    color: "from-emerald-500 to-green-500",
  },
];

const resourceCards: CardItem[] = [
  {
    title: "Opportunities",
    description: "Programs & experiences.",
    href: "/resources/opportunities",
    icon: Briefcase,
    color: "from-sky-500 to-blue-500",
    badge: "PRO",
  },
  {
    title: "Scholarships",
    description: "Find funding options.",
    href: "/resources/scholarships",
    icon: DollarSign,
    color: "from-orange-500 to-amber-500",
    badge: "PRO",
  },
  {
    title: "Accommodation",
    description: "Colleges and housing.",
    href: "/resources/accommodation",
    icon: Building2,
    color: "from-fuchsia-500 to-violet-500",
    badge: "PRO",
  },
  {
    title: "Budget",
    description: "Calculate living cost.",
    href: "/resources/budget",
    icon: Calculator,
    color: "from-cyan-500 to-teal-500",
    badge: "PRO",
  },
];

const toolCards: CardItem[] = [
  {
    title: "Strategy Hub",
    description: "Your application roadmap.",
    href: "/tools/strategy-hub",
    icon: Target,
    color: "from-pink-500 to-violet-500",
    badge: "PRO",
  },
  {
    title: "Study Engine",
    description: "Internals & externals analysis.",
    href: "/tools/study-engine",
    icon: BookOpen,
    color: "from-indigo-500 to-blue-500",
    badge: "PRO",
  },
  {
    title: "Train",
    description: "UCAT, ATAR & interview.",
    href: "/tools/train",
    icon: Brain,
    color: "from-pink-500 to-fuchsia-500",
    badge: "PRO",
  },
  {
    title: "Optimise",
    description: "Compare & strategise.",
    href: "/tools/optimise",
    icon: Sparkles,
    color: "from-orange-500 to-rose-500",
    badge: "PRO",
  },
  {
    title: "Resilience",
    description: "Burnout risk & wellbeing.",
    href: "/tools/resilience",
    icon: HeartHandshake,
    color: "from-violet-500 to-purple-500",
    badge: "PRO",
  },
  {
    title: "Command",
    description: "Your personal dashboard.",
    href: "/tools/command",
    icon: Stethoscope,
    color: "from-slate-600 to-slate-800",
    badge: "PRO",
  },
];

const infoCards: CardItem[] = [
  {
    title: "Pricing",
    description: "View plans and features.",
    href: "/info/pricing",
    icon: Compass,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "About",
    description: "About this guide.",
    href: "/info/about",
    icon: UserRound,
    color: "from-slate-500 to-slate-700",
  },
];

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function SoftCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:bg-white/90 sm:shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 sm:mb-6">
      <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}

function HomeCard({ item }: { item: CardItem }) {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="group block h-full">
      <SoftCard className="flex h-full min-h-64 flex-col justify-between p-4 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] sm:p-5">
        <div>
          <div
            className={cx(
              "mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-sm sm:h-14 sm:w-14",
              item.color
            )}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-[1.7rem]">
            {item.title}
          </h3>

          {item.badge ? (
            <div className="mt-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                {item.badge}
              </span>
            </div>
          ) : null}

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {item.description}
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:text-emerald-700">
          Open
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </SoftCard>
    </Link>
  );
}

function WelcomeHero() {
  return (
    <section className="mb-8 sm:mb-10">
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-5 py-7 text-white shadow-sm sm:px-8 sm:py-12 sm:shadow-[0_25px_70px_rgba(16,185,129,0.35)] lg:px-10 lg:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50 sm:px-4 sm:py-2 sm:text-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Medicine Entry Resource Hub
          </span>

          <h1 className="mt-4 text-3xl font-black leading-[0.98] tracking-tight text-white sm:mt-5 sm:text-6xl lg:text-7xl">
            Welcome to the
            <br />
            Aussie Med Guide
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-emerald-50/95 sm:mt-5 sm:text-base sm:leading-8 lg:text-xl">
            Your comprehensive tool for navigating Australian medical school
            admissions. From ATAR and UCAT requirements to scholarships and
            accommodation. Built by a med student for aspiring doctors.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:hidden">
            {[
              { value: "21", label: "Schools" },
              { value: "8", label: "States" },
              { value: "3", label: "Pathways" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 px-3 py-3 ring-1 ring-white/10"
              >
                <div className="text-2xl font-black tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] text-emerald-50/90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 hidden sm:grid sm:grid-cols-3 sm:gap-4">
            {[
              { icon: GraduationCap, value: "21", label: "Med Schools" },
              { icon: Map, value: "8", label: "States & Territories" },
              { icon: BookOpen, value: "3", label: "Entry Pathways" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10"
              >
                <stat.icon className="mx-auto h-7 w-7 text-white" />
                <div className="mt-4 text-5xl font-black tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-emerald-50/90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CardSection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: CardItem[];
}) {
  const isCompact = items.length <= 2;

  return (
    <section className="mb-12 sm:mb-14">
      <SectionHeader title={title} subtitle={subtitle} />
      <div
        className={cx(
          "grid grid-cols-1 auto-rows-fr gap-4 md:grid-cols-2",
          isCompact ? "xl:grid-cols-2" : "xl:grid-cols-4"
        )}
      >
        {items.map((item) => (
          <HomeCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 sm:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_24%),radial-gradient(circle_at_right,rgba(139,92,246,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6f7fb_42%,#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <WelcomeHero />
        <RoadmapSectionHome />

        <CardSection
          title="Blueprint"
          subtitle="Structured guides for parents and international students"
          items={blueprintCards}
        />

        <CardSection
          title="Explore"
          subtitle="Understand the landscape"
          items={exploreCards}
        />

        <CardSection
          title="Resources"
          subtitle="Funding and support"
          items={resourceCards}
        />

        <CardSection
          title="Tools"
          subtitle="Your premium application toolkit"
          items={toolCards}
        />

        <section>
          <SectionHeader title="Info" subtitle="Learn more" />
          <div className="grid grid-cols-1 auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-2">
            {infoCards.map((item) => (
              <HomeCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}