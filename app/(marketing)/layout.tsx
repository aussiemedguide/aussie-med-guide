  import type { ReactNode } from "react";
  import GlobalFooter from "@/components/global/GlobalFooter";
  import MarketingSidebar from "@/components/marketing/MarketingSidebar";

  export default function MarketingLayout({
    children,
  }: {
    children: ReactNode;
  }) {
    return (
      <>
        <div className="flex">
          <MarketingSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <GlobalFooter />
      </>
    );
  }

