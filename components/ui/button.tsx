import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-signal-gradient text-white hover:brightness-110 shadow-[0_4px_20px_-4px_rgba(91,95,239,0.5)]",
  secondary:
    "bg-void-card2 text-ink hover:bg-void-borderLight border border-void-border",
  ghost: "text-ink-muted hover:text-ink hover:bg-void-card2",
  danger: "bg-loss text-white hover:brightness-110",
  outline: "border border-void-borderLight text-ink hover:bg-void-card2",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

// React 19: forwardRef is no longer needed — refs are passed as props directly
export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ref,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus-ring disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
