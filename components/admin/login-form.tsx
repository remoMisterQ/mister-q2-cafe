"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
      else router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Supabase is not configured.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
      <h1 className="text-3xl font-black text-espresso">Admin login</h1>
      <Input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <Button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
    </form>
  );
}
