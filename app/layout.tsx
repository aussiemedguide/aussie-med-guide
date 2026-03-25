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
  applicationName: "Aussie Med Guide",
  authors: [{ name: "Aussie Med Guide" }],
  creator: "Aussie Med Guide",
  publisher: "Aussie Med Guide",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aussie Med Guide",
    description:
      "Compare Australian medical schools, understand entry requirements, and prepare for UCAT, ATAR, and interviews.",
    url: "https://aussiemedguide.com",
    siteName: "Aussie Med Guide",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aussie Med Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aussie Med Guide",
    description:
      "Compare Australian medical schools, understand entry requirements, and prepare for UCAT, ATAR, and interviews.",
    images: ["/og-image.png"],
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

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en">
        <body className={jakarta.className}>
          <PostHogProvider>{children}</PostHogProvider>
          <GoogleAnalytics gaId="G-WTQDQGY7EY" />
        </body>
      </html>
    </ClerkProvider>
  );
}