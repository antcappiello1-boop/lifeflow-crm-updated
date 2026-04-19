import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function StatCard({
  label, value, hint, accent = "ink", href, icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "ink" | "amber" | "success" | "danger" | "info";
  href?: string;
  icon?: ReactNode;
}) {
  const accentMap = {
    ink:     "text-ink-900",
    amber:   "text-amber-600",
    success: "text-success-600",
    danger:  "text-danger-600",
    info:    "text-info-600",
  };
  const iconBgMap = {
    ink:     "bg-ink-100 text-ink-700",
    amber:   "bg-amber-100 text-amber-700",
    success: "bg-success-50 text-success-700",
    danger:  "bg-danger-50 text-danger-700",
    info:    "bg-info-50 text-info-700",
  };

  const content = (
    <div className={cn(
      "group bg-white rounded-xl shadow-card ring-1 ring-ink-100 p-5 h-full transition-all",
      href && "hover:shadow-card-hover hover:ring-ink-200 cursor-pointer",
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wider">{label}</p>
          <p className={cn("font-display text-3xl font-semibold mt-2 tabular", accentMap[accent])}>
            {value}
          </p>
          {hint && <p className="text-xs text-ink-500 mt-1.5">{hint}</p>}
        </div>
        {icon && (
          <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0", iconBgMap[accent])}>
            {icon}
          </div>
        )}
      </div>
      {href && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-ink-500 group-hover:text-ink-900">
          View <ArrowUpRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
