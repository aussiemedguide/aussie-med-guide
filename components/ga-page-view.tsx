"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GaPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_path: url,
      page_location: window.location.href,
      send_to: "G-WTQDQGY7EY",
    });
  }, [pathname, searchParams]);

  return null;
}