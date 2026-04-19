"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const { loading, user, hasAccess, missingConfig } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (missingConfig) return;
    if (!user && pathname !== "/login") {
      router.replace("/login");
      return;
    }
    if (user && !hasAccess && pathname !== "/subscribe") {
      router.replace("/subscribe");
    }
  }, [loading, user, hasAccess, pathname, router, missingConfig]);

  if (missingConfig) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl bg-white p-8 shadow-card-hover ring-1 ring-ink-100">
          <h1 className="font-display text-2xl font-semibold text-ink-900">Finish setup</h1>
          <p className="mt-2 text-sm text-ink-600">
            Add your Supabase and Stripe environment variables in Vercel or .env.local, then redeploy.
          </p>
          <pre className="mt-4 rounded-xl bg-ink-950 p-4 text-xs text-ink-100 overflow-x-auto">NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\nSUPABASE_SERVICE_ROLE_KEY=\nSTRIPE_SECRET_KEY=\nSTRIPE_PRICE_ID=\nSTRIPE_WEBHOOK_SECRET=</pre>
        </div>
      </div>
    );
  }

  if (loading || !user || !hasAccess) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="text-sm text-ink-500">Loading LifeFlow…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 lg:mb-8">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-ink-500 mt-1.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function EmptyPanel({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-8 text-center shadow-card ring-1 ring-ink-100">
      <h3 className="font-display text-xl text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-500">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
