import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const siteUrl = "https://www.aussiemedguide.com";
const siteName = "Aussie Med Guide";
const siteDescription =
  "Aussie Med Guide helps Australian medicine applicants compare universities, understand UCAT and ATAR requirements, prepare for interviews, and plan their pathway.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Aussie Med Guide",
    "medicine entry Australia",
    "medical school Australia",
    "Australian medical schools",
    "UCAT Australia",
    "ATAR medicine",
    "medicine interview preparation",
    "medical school comparison Australia",
  ],
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteName,
    description:
      "Compare Australian medical schools, understand entry requirements, and prepare for UCAT, ATAR, and interviews.",
    url: siteUrl,
    siteName,
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description:
      "Compare Australian medical schools, understand entry requirements, and prepare for UCAT, ATAR, and interviews.",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const isProduction = process.env.NODE_ENV === "production";
const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-7802393RB0";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        </head>
        <body
          className={`${jakarta.className} min-h-screen bg-white text-slate-900 antialiased`}
        >
          {children}
          {isProduction && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        </body>
      </html>
    </ClerkProvider>
  );
}