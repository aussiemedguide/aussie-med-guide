"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  GraduationCap,
  Heart,
  Instagram,
  Mail,
  MessageCircle,
  Users,
  UserRound,
  Camera,
} from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60",
        className
      )}
    >
      {children}
    </section>
  );
}

function HelpCard({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  tone: "blue" | "violet" | "emerald";
}) {
  const tones = {
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="rounded-3xl bg-slate-50 p-5 text-center">
      <div
        className={cn(
          "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl",
          tones[tone]
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function ContactCard({
  href,
  icon: Icon,
  title,
  subtitle,
  value,
  tone,
}: {
  href: string;
  icon: typeof Mail;
  title: string;
  subtitle: string;
  value: string;
  tone: "rose" | "blue" | "emerald" | "violet" | "amber";
}) {
  const tones = {
    rose: "border-rose-200 bg-rose-50",
    blue: "border-blue-200 bg-blue-50",
    emerald: "border-emerald-200 bg-emerald-50",
    violet: "border-violet-200 bg-violet-50",
    amber: "border-amber-200 bg-amber-50",
  };

  const iconTones = {
    rose: "bg-rose-500 text-white",
    blue: "bg-blue-500 text-white",
    emerald: "bg-emerald-600 text-white",
    violet: "bg-violet-600 text-white",
    amber: "bg-amber-500 text-white",
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border p-4 transition hover:scale-[1.01] hover:shadow-sm",
        tones[tone]
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            iconTones[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-slate-950">{title}</div>
          <div className="text-sm text-slate-600">{subtitle}</div>
          <div className="text-xs text-slate-500">{value}</div>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-slate-500" />
    </Link>
  );
}

export default function AboutFounderPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-700">
            <UserRound className="h-5 w-5" />
            <span className="text-sm font-semibold">About the Founder</span>
          </div>
          <div>
            <h1 className="font-serif text-4xl text-slate-950">
              Meet the creator of Aussie Med Guide
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Learn more about the story behind Aussie Med Guide and where
              students and parents can connect with the community.
            </p>
          </div>
        </div>

        <SectionCard>
          <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="overflow-hidden rounded-3xl bg-slate-200">
              <Image
                src="/images/founder/manu-founder.JPG"
                alt="Manu Masabattula speaking"
                width={700}
                height={900}
                className="h-full min-h-80 w-full object-cover"
                priority
              />
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-3xl text-slate-950">
                  Manu Masabattula
                </h2>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Founder
                </span>
              </div>

              <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                <p>
                  Hey! I’m Manu, a student who recently went through the entire
                  medicine application process in Australia. I know firsthand
                  how overwhelming and confusing it can be to navigate UCAT,
                  ATAR requirements, interviews, and all the different
                  university pathways.
                </p>
                <p>
                  I built Aussie Med Guide because I wished something like this
                  existed when I was going through the process. My goal is to
                  make medicine entry more accessible, less stressful, and more
                  community-driven for aspiring medical students across
                  Australia.
                </p>
                <p>
                  Aussie Med Guide is now more than just a guide, it’s becoming
                  a space where students can connect, learn, and support each
                  other, while parents can also stay informed through dedicated
                  channels.
                </p>
              </div>

              <div className="space-y-3">
                <ContactCard
                  href="https://discord.gg/CSzpvVm4"
                  icon={Users}
                  title="Discord Community"
                  subtitle="Join the AMG student server"
                  value="Connect, ask questions, and meet other students"
                  tone="violet"
                />
                <ContactCard
                  href="https://www.instagram.com/aussiemedguide"
                  icon={Instagram}
                  title="Instagram"
                  subtitle="@aussiemedguide"
                  value="Student updates, med entry content, and announcements"
                  tone="rose"
                />
                <ContactCard
                  href="https://www.tiktok.com/@aussie.med.guide"
                  icon={Camera}
                  title="TikTok"
                  subtitle="@aussie.med.guide"
                  value="Short-form tips, advice, and student content"
                  tone="blue"
                />
                <ContactCard
                  href="https://www.facebook.com/share/1Dt9fKjMpX/?mibextid=wwXIfr"
                  icon={MessageCircle}
                  title="Facebook for Parents"
                  subtitle="@Aussiemedguide"
                  value="Parent-facing updates, guidance, and community support"
                  tone="emerald"
                />
                <ContactCard
                  href="mailto:aussiemedguide@gmail.com"
                  icon={Mail}
                  title="Email"
                  subtitle="aussiemedguide@gmail.com"
                  value="Best for questions, partnerships, and collabs"
                  tone="amber"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="mb-5 flex items-center gap-2 text-slate-950">
            <GraduationCap className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-semibold">How Aussie Med Guide Helps</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <HelpCard
              icon={GraduationCap}
              title="ATAR Prep"
              description="Study strategies and subject advice for achieving your target ATAR with more clarity and structure."
              tone="blue"
            />
            <HelpCard
              icon={Users}
              title="UCAT Strategy"
              description="Tips, practice strategy, timing techniques, and practical advice for improving UCAT performance."
              tone="violet"
            />
            <HelpCard
              icon={Heart}
              title="Interview Prep"
              description="MMI practice, common scenarios, and confidence-building support for medical interviews."
              tone="emerald"
            />
          </div>
        </SectionCard>

        <SectionCard className="border-emerald-200 bg-linear-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">My Mission</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-white/90 sm:text-base">
                To make the medicine application process more transparent,
                accessible, and connected for Australian students and families,
                regardless of their background or location. Every aspiring
                doctor deserves quality information, practical guidance, and a
                supportive community around them.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="border-amber-200 bg-amber-50">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-amber-950">
                Important Disclaimer
              </h2>
              <p className="mt-2 text-sm leading-7 text-amber-900">
                Aussie Med Guide is an independent resource created to help
                students navigate medicine entry. This guide is for
                informational purposes only. I am not responsible for any
                decisions you make based on this information. While I strive to
                keep information accurate and up to date, always verify details
                with official university websites and admissions centres such as
                QTAC, VTAC, UAC, SATAC, and TISC. Entry requirements and
                policies can change annually.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}