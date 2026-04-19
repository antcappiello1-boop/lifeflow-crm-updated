import { format, formatDistanceToNow, isToday, isYesterday, isPast } from "date-fns";

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const moneyCents = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const prettyDate = (iso?: string) => iso ? format(new Date(iso), "MMM d, yyyy") : "—";
export const prettyDateTime = (iso?: string) => iso ? format(new Date(iso), "MMM d, h:mm a") : "—";
export const prettyTime = (iso?: string) => iso ? format(new Date(iso), "h:mm a") : "—";

export const relative = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isToday(d)) return `Today · ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday · ${format(d, "h:mm a")}`;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const isOverdue = (iso?: string) => !!iso && isPast(new Date(iso)) && !isToday(new Date(iso));

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
