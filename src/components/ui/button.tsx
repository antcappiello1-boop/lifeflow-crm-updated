import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:   "bg-ink-900 text-white hover:bg-ink-800 shadow-sm",
  secondary: "bg-white text-ink-900 hover:bg-ink-50 ring-1 ring-inset ring-ink-200 shadow-sm",
  ghost:     "text-ink-700 hover:bg-ink-100",
  danger:    "bg-danger-600 text-white hover:bg-danger-700 shadow-sm",
  outline:   "bg-transparent text-ink-900 ring-1 ring-inset ring-ink-300 hover:bg-ink-50",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", iconLeft, iconRight, className, children, ...rest }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  ),
);
Button.displayName = "Button";
