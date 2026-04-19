import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

export function Avatar({
  name, color = "bg-ink-700", size = "md",
}: { name: string; color?: string; size?: "sm" | "md" | "lg" }) {
  const cls = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  }[size];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white tracking-wide",
        color, cls,
      )}
      title={name}
    >
      {initials(name)}
    </span>
  );
}
