"use client";

import { useState } from "react";
import { Brain, RefreshCw, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, signalTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceRibbon } from "@/components/ui/confidence-ribbon";
import { AI_SIGNALS } from "@/lib/mock-data";
import { AISignal } from "@/types";
import { formatUsd, timeAgo } from "@/lib/utils";

const riskColors = {
  Low: "text-gain",
  Medium: "text-amber-400",
  High: "text-loss",
};

const leanIcon = {
  BUY: <TrendingUp size={12} className="text-gain" />,
  SELL: <TrendingDown size={12} className="text-loss" />,
  HOLD: <Minus size={12} className="text-signal-indigo" />,
};

function SignalCard({ sig }: { sig: AISignal }) {
  const [expanded, setExpanded] = useState(false);
  const rr = ((sig.takeProfit - sig.entryPrice) / (sig.entryPrice - sig.stopLoss)).toFixed(2);

  return (
    <Card className={`transition-all duration-200 ${expanded ? "shadow-glow" : ""}`}>
      {/* Header */}
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-void-card2 font-display text-sm font-bold text-signal-indigo">
            {sig.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-ink">{sig.symbol}</span>
              <Badge tone={signalTone(sig.action)} className="text-xs font-bold">
                {sig.action}
              </Badge>
              <span className="text-xs text-ink-muted capitalize">{sig.assetClass}</span>
            </div>
            <p className="text-xs text-ink-muted">{sig.timeframe} chart · {timeAgo(sig.generatedAt)}</p>
          </div>
        </div>
        <span className={`text-sm font-semibold ${riskColors[sig.riskLevel]}`}>
          {sig.riskLevel} Risk
        </span>
      </CardHeader>

      <CardBody className="pt-4 space-y-4">
        {/* Confidence ribbon */}
        <ConfidenceRibbon confidence={sig.confidence} />

        {/* Key levels grid */}
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-void-card2 p-3 text-xs">
          <div>
            <p className="text-ink-muted">Entry Price</p>
            <p className="mt-0.5 font-mono font-semibold text-ink">{formatUsd(sig.entryPrice)}</p>
          </div>
          <div>
            <p className="text-ink-muted">Stop Loss</p>
            <p className="mt-0.5 font-mono font-semibold text-loss">{formatUsd(sig.stopLoss)}</p>
          </div>
          <div>
            <p className="text-ink-muted">Take Profit</p>
            <p className="mt-0.5 font-mono font-semibold text-gain">{formatUsd(sig.takeProfit)}</p>
          </div>
          <div>
            <p className="text-ink-muted">Risk:Reward</p>
            <p className="mt-0.5 font-mono font-semibold text-ink">1 : {rr}</p>
          </div>
          <div>
            <p className="text-ink-muted">Position Size</p>
            <p className="mt-0.5 font-mono font-semibold text-ink">{sig.recommendedPositionPct}%</p>
          </div>
          <div>
            <p className="text-ink-muted">Timeframe</p>
            <p className="mt-0.5 font-mono font-semibold text-ink">{sig.timeframe}</p>
          </div>
        </div>

        {/* Model breakdown */}
        <div className="space-y-2">
          {sig.modelBreakdown.map((m) => (
            <div key={m.label} className="flex items-center gap-2 text-xs">
              <span className="w-36 shrink-0 text-ink-muted">{m.label}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-void-card2 h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${m.weight}%`,
                    background:
                      m.lean === "BUY"
                        ? "#22D3C7"
                        : m.lean === "SELL"
                        ? "#F0426B"
                        : "#5B5FEF",
                  }}
                />
              </div>
              <span className="w-8 text-right font-mono text-ink-muted">{m.weight}%</span>
              <span className="flex items-center gap-0.5">{leanIcon[m.lean]}</span>
            </div>
          ))}
        </div>

        {/* Expand/collapse reasoning */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
        >
          <span>AI Reasoning</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="space-y-3 rounded-xl border border-void-border bg-void-card2 p-4 text-xs leading-relaxed">
            <div>
              <p className="mb-1 font-semibold uppercase tracking-wider text-signal-indigo">
                Technical Analysis
              </p>
              <p className="text-ink-muted">{sig.reasoning.technical}</p>
            </div>
            <div>
              <p className="mb-1 font-semibold uppercase tracking-wider text-signal-violet">
                Sentiment
              </p>
              <p className="text-ink-muted">{sig.reasoning.sentiment}</p>
            </div>
            <div>
              <p className="mb-1 font-semibold uppercase tracking-wider text-gain">
                ML Model
              </p>
              <p className="text-ink-muted">{sig.reasoning.model}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {sig.action !== "HOLD" ? (
            <>
              <Button variant="primary" size="sm" className="flex-1">
                Execute {sig.action}
              </Button>
              <Button variant="secondary" size="sm">
                Save
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" className="flex-1" disabled>
              Waiting for setup
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function PositionCalculator() {
  const [accountBalance, setAccountBalance] = useState("163540");
  const [riskPct, setRiskPct] = useState("2");
  const [entryPrice, setEntryPrice] = useState("71284");
  const [stopPrice, setStopPrice] = useState("69100");

  const balance = parseFloat(accountBalance) || 0;
  const risk = parseFloat(riskPct) || 0;
  const entry = parseFloat(entryPrice) || 1;
  const stop = parseFloat(stopPrice) || 0;

  const riskAmount = balance * (risk / 100);
  const priceDiff = Math.abs(entry - stop);
  const units = priceDiff > 0 ? riskAmount / priceDiff : 0;
  const positionValue = units * entry;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Position Calculator</CardTitle>
        <AlertTriangle size={16} className="text-amber-400" />
      </CardHeader>
      <CardBody className="space-y-3 pt-4">
        {[
          { label: "Account Balance ($)", value: accountBalance, set: setAccountBalance },
          { label: "Risk %", value: riskPct, set: setRiskPct },
          { label: "Entry Price ($)", value: entryPrice, set: setEntryPrice },
          { label: "Stop Loss ($)", value: stopPrice, set: setStopPrice },
        ].map((f) => (
          <div key={f.label}>
            <label className="mb-1 block text-xs font-medium text-ink-muted">{f.label}</label>
            <input
              type="number"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="w-full rounded-lg border border-void-border bg-void-card2 px-3 py-2 font-mono text-sm text-ink focus:border-signal-indigo focus:outline-none"
            />
          </div>
        ))}
        <div className="space-y-2 rounded-xl border border-void-border bg-void-card2 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-ink-muted">Risk amount</span>
            <span className="font-mono font-semibold text-loss">{formatUsd(riskAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Units to buy</span>
            <span className="font-mono font-semibold text-ink">{units.toFixed(6)}</span>
          </div>
          <div className="flex justify-between border-t border-void-border pt-2">
            <span className="font-medium text-ink">Position value</span>
            <span className="font-mono font-bold text-signal-indigo">{formatUsd(positionValue)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function AssistantView() {
  const [filter, setFilter] = useState<"all" | "crypto" | "forex">("all");
  const [actionFilter, setActionFilter] = useState<"all" | "BUY" | "SELL" | "HOLD">("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const filtered = AI_SIGNALS.filter((s) => {
    if (filter !== "all" && s.assetClass !== filter) return false;
    if (actionFilter !== "all" && s.action !== actionFilter) return false;
    return true;
  });

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1800);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute h-10 w-10 rounded-full bg-signal-violet/20 animate-pulse_ring" />
            <Brain size={20} className="relative text-signal-violet" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">AI Trading Assistant</h1>
            <p className="text-sm text-ink-muted">{AI_SIGNALS.length} signals generated · Last run 6m ago</p>
          </div>
        </div>
        <Button onClick={handleRegenerate} disabled={isGenerating} size="sm">
          <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? "Generating..." : "Regenerate"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "crypto", "forex"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "border-signal-indigo bg-signal-indigo/10 text-signal-indigo"
                : "border-void-border text-ink-muted hover:border-void-borderLight hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="w-px bg-void-border mx-1" />
        {(["all", "BUY", "SELL", "HOLD"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setActionFilter(a)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              actionFilter === a
                ? a === "BUY"
                  ? "border-gain/40 bg-gain/10 text-gain"
                  : a === "SELL"
                  ? "border-loss/40 bg-loss/10 text-loss"
                  : "border-signal-indigo/40 bg-signal-indigo/10 text-signal-indigo"
                : "border-void-border text-ink-muted hover:text-ink"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-void-border text-sm text-ink-muted">
              No signals match the current filters.
            </div>
          ) : (
            filtered.map((sig) => <SignalCard key={sig.id} sig={sig} />)
          )}
        </div>

        <div className="space-y-4">
          <PositionCalculator />

          {/* Market overview stat card */}
          <Card>
            <CardHeader>
              <CardTitle>Signal Summary</CardTitle>
            </CardHeader>
            <CardBody className="pt-3 space-y-2">
              {[
                { label: "BUY signals", count: AI_SIGNALS.filter((s) => s.action === "BUY").length, color: "text-gain" },
                { label: "SELL signals", count: AI_SIGNALS.filter((s) => s.action === "SELL").length, color: "text-loss" },
                { label: "HOLD signals", count: AI_SIGNALS.filter((s) => s.action === "HOLD").length, color: "text-signal-indigo" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between rounded-lg bg-void-card2 px-3 py-2 text-sm">
                  <span className="text-ink-muted">{s.label}</span>
                  <span className={`font-mono font-bold ${s.color}`}>{s.count}</span>
                </div>
              ))}
              <div className="pt-1 text-xs text-ink-muted leading-relaxed">
                Signals are generated using LSTM, XGBoost, Transformer, and NLP sentiment models across multiple timeframes.
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
