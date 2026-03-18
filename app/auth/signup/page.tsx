"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email to confirm your account.");
  }

  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) alert(error.message);
  }

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold">Create account</h1>
      <div className="mt-6 space-y-4">
        <button onClick={handleGoogleSignup} className="w-full rounded-xl border p-3 font-semibold">
          Continue with Google
        </button>
        <input className="w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-xl border p-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignup} className="w-full rounded-xl bg-emerald-600 p-3 font-semibold text-white">
          Sign up
        </button>
      </div>
    </div>
  );
}