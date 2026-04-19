"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Users, GitBranch, CheckSquare, FileText,
  Building2, BarChart3, Settings, Menu, X, Zap, CreditCard, LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Pipeline", href: "/pipeline", icon: GitBranch },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Applications", href: "/applications", icon: FileText },
  { label: "Carriers", href: "/carriers", icon: Building2 },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Billing", href: "/subscribe", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const Inner = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-lg bg-ink-900 text-white flex items-center justify-center shadow-sm">
          <Zap className="h-5 w-5 text-amber-400" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display text-lg font-semibold leading-none text-ink-900">LifeFlow</div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-ink-400 mt-0.5">Insurance CRM</div>
        </div>
      </div>

      <nav className="px-3 mt-2 flex-1 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-ink-900 text-white shadow-sm" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.25 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 m-3 mt-2 rounded-lg bg-ink-50 ring-1 ring-ink-100">
        <div className="flex items-center gap-3">
          <Avatar name={profile?.full_name || profile?.email || "User"} color="bg-ink-700" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-ink-900 truncate">{profile?.full_name || "LifeFlow user"}</div>
            <div className="text-xs text-ink-500 truncate capitalize">{profile?.role || "owner"}</div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-3 w-full justify-start"
          iconLeft={<LogOut className="h-4 w-4" />}
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-ink-100 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-ink-900 text-white flex items-center justify-center">
            <Zap className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold">LifeFlow</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-ink-100" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-ink-100 z-20">{Inner}</aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-md hover:bg-ink-100" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
            {Inner}
          </aside>
        </div>
      )}
    </>
  );
}
