"use client";

import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <UserProfile
          appearance={{
            elements: {
              card: "shadow-none border-0 rounded-none",
              navbar: "bg-slate-50",
              pageScrollBox: "p-0",
            },
          }}
        />
      </div>
    </div>
  );
}