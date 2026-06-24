"use client";

import { cn } from "@/lib/utils";

export function ConfidenceRibbon({
  confidence,
  className,
}: {
  confidence: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-muted">AI confidence</span>
        <span className="font-mono font-semibold text-ink">{confidence}%</span>
      </div>
      <div className="confidence-ribbon">
        <div
          className="confidence-ribbon-fill animate-shimmer"
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
