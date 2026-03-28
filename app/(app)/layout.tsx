import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "../providers";

export default function AppLayout({
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
      <PostHogProvider>{children}</PostHogProvider>
    </ClerkProvider>
  );
}