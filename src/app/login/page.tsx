"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Zap, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, user, hasAccess, loading, missingConfig } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) router.replace(hasAccess ? "/dashboard" : "/subscribe");
  }, [loading, user, hasAccess, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = mode === "signin"
      ? await signIn(email, password)
      : await signUp(fullName, email, password);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    if (mode === "signup") {
      const signInResult = await signIn(email, password);
      if (signInResult.error) setError(signInResult.error);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="h-11 w-11 rounded-xl bg-ink-900 text-white flex items-center justify-center shadow-card">
            <Zap className="h-6 w-6 text-amber-400" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display text-2xl font-semibold text-ink-900 leading-none">LifeFlow</div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-400 mt-1">Insurance CRM</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card-hover ring-1 ring-ink-100 p-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-semibold text-ink-900">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              {mode === "signin" ? "Sign in to manage your book of business." : "Start your 7-day free trial and launch your CRM."}
            </p>
          </div>

          {missingConfig && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Supabase isn’t configured yet. Add your environment variables first.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1.5">Full name</label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Anthony Cappiello"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="you@agency.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-ink-700">Password</label>
                <span className="text-xs text-ink-400">Minimum 6 characters</span>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {error && <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</div>}

            <Button disabled={submitting || missingConfig} type="submit" size="lg" className="w-full mt-2">
              {submitting ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-100 text-center text-sm text-ink-500">
            {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
            <button className="font-medium text-amber-600 hover:text-amber-700" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}> 
              {mode === "signin" ? "Start free trial" : "Sign in"}
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-ink-400">
            By continuing you agree to the 7-day trial, then $99/mo.
          </div>
          <div className="mt-1 text-center text-xs text-ink-400">
            <Link href="/subscribe" className="text-amber-600 hover:text-amber-700">See billing details</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
