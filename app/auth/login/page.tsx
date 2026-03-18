"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/";
  }

  async function handleGoogleLogin() {
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
      <h1 className="text-2xl font-bold">Log in</h1>
      <div className="mt-6 space-y-4">
        <button onClick={handleGoogleLogin} className="w-full rounded-xl border p-3 font-semibold">
          Continue with Google
        </button>
        <input className="w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-xl border p-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white">
          Log in
        </button>
      </div>
    </div>
  );
}