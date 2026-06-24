import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Tone = "neutral" | "buy" | "sell" | "hold" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-void-card2 text-ink-muted border-void-border",
  buy: "bg-gain/10 text-gain border-gain/30",
  sell: "bg-loss/10 text-loss border-loss/30",
  hold: "bg-signal-indigo/10 text-signal-indigo border-signal-indigo/30",
  success: "bg-gain/10 text-gain border-gain/30",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  danger: "bg-loss/10 text-loss border-loss/30",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  dot,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "buy" || tone === "success"
              ? "bg-gain"
              : tone === "sell" || tone === "danger"
              ? "bg-loss"
              : tone === "warning"
              ? "bg-amber-400"
              : "bg-signal-indigo"
          )}
        />
      )}
      {children}
    </span>
  );
}

export function signalTone(action: "BUY" | "SELL" | "HOLD"): Tone {
  if (action === "BUY") return "buy";
  if (action === "SELL") return "sell";
  return "hold";
}
