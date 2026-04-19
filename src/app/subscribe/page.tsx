"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export default function SubscribePage() {
  const { user, session, hasAccess, loading, subscription, refreshProfile } = useAuth();
  const router = useRouter();
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (hasAccess) {
      router.replace("/dashboard");
    }
  }, [loading, user, hasAccess, router]);

  const startCheckout = async () => {
    setStartingCheckout(true);
    setError(null);
    const res = await fetch("/api/checkout", { method: "POST", headers: { Authorization: `Bearer ${session?.access_token || ""}` } });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to start checkout.");
      setStartingCheckout(false);
      return;
    }
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-[1.1fr,0.9fr] gap-6">
        <div className="rounded-2xl bg-white p-8 shadow-card-hover ring-1 ring-ink-100">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="h-11 w-11 rounded-xl bg-ink-900 text-white flex items-center justify-center shadow-card">
              <Zap className="h-6 w-6 text-amber-400" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-ink-900 leading-none">LifeFlow CRM</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-400 mt-1">7-day free trial</div>
            </div>
          </div>

          <h1 className="font-display text-4xl text-ink-900 leading-tight">Start your free trial today.</h1>
          <p className="mt-3 text-ink-600">
            Unlock the full CRM with a 7-day trial, then continue for <span className="font-semibold text-ink-900">$99/month</span>.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Real lead storage and pipeline management",
              "Tasks, follow-ups, and activity timeline",
              "Carrier matching built for life insurance sales",
              "Stripe billing and account protection ready to go",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-success-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {error && <div className="mt-5 rounded-xl bg-danger-50 p-3 text-sm text-danger-700">{error}</div>}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button size="lg" disabled={startingCheckout || !user} iconLeft={<CreditCard className="h-4 w-4" />} onClick={startCheckout}>
              {startingCheckout ? "Redirecting…" : "Start 7-day free trial"}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => void refreshProfile()}>
              Refresh billing status
            </Button>
          </div>

          <p className="mt-4 text-xs text-ink-400">
            Trial starts after checkout. We collect payment details up front so your CRM stays live when the trial ends.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-card-hover ring-1 ring-ink-100">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Billing status
          </div>
          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-500">Email</dt>
              <dd className="mt-1 text-sm text-ink-900">{user?.email || "Not signed in"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-500">Current access</dt>
              <dd className="mt-1 text-sm text-ink-900 capitalize">{subscription?.status || "Inactive"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-500">Trial ends</dt>
              <dd className="mt-1 text-sm text-ink-900">{subscription?.trial_ends_at ? new Date(subscription.trial_ends_at).toLocaleString() : "Starts after checkout"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-500">Renewal</dt>
              <dd className="mt-1 text-sm text-ink-900">$99 / month</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
