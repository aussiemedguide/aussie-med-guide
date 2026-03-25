import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PostHogProvider } from "./providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aussiemedguide.com"),
  title: {
    default: "Aussie Med Guide",
    template: "%s | Aussie Med Guide",
  },
  description:
    "Aussie Med Guide helps Australian medicine applicants compare universities, understand UCAT and ATAR requirements, prepare for interviews, and plan their pathway.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="en">
        <body className={jakarta.className}>
          <PostHogProvider>{children}</PostHogProvider>
          {process.env.NEXT_PUBLIC_GA_ID ? (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          ) : null}
        </body>
      </html>
    </ClerkProvider>
  );
}