"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ActiveNavLink, {
  type NavIconKey,
} from "@/components/marketing/ActiveNavLink";

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

function SidebarSections({
  sections,
  onItemClick,
}: {
  sections: NavSection[];
  onItemClick?: () => void;
}) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items
              .filter((item) => item.href && item.label && item.icon)
              .map((item) => (
                <ActiveNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  onClick={onItemClick}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MobileSidebarShell({
  sections,
}: {
  sections: NavSection[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">

            <Image
             src="/images/logo/amg-logo.svg"
             alt="Aussie Med Guide logo"
             width={44}
             height={44}
             sizes="44px"
             className="h-full w-full transition-transform group-hover:scale-105"
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

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
        />
      ) : null}

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
              src="/images/logo/amg-logo.svg"
              alt="Aussie Med Guide logo"
              width={44}
              height={44}
              sizes="44px"
              className="h-full w-full transition-transform group-hover:scale-105"
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
            sections={sections}
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
    </>
  );
}