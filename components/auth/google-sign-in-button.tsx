"use client";

import { createClient } from "@/lib/supabase/client";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
    >
      Continue with Google
    </button>
  );
}