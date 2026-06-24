"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  ArrowRight,
  Brain,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, signalTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceRibbon } from "@/components/ui/confidence-ribbon";
import { Sparkline } from "@/components/ui/sparkline";
import { PORTFOLIO_HOLDINGS } from "@/lib/mock-portfolio";
import { AI_SIGNALS, SENTIMENT_TREND } from "@/lib/mock-data";
import { formatUsd, formatPercent, timeAgo } from "@/lib/utils";
import {
  DAILY_LOSS_LIMIT_USD,
  DAILY_LOSS_USED_USD,
  MAX_DRAWDOWN_LIMIT_PCT,
  CURRENT_DRAWDOWN_PCT,
} from "@/lib/mock-portfolio";

const PNL_HISTORY = [
  { date: "Jun 1", value: 142000 },
  { date: "Jun 3", value: 145800 },
  { date: "Jun 5", value: 141200 },
  { date: "Jun 7", value: 148500 },
  { date: "Jun 9", value: 152300 },
  { date: "Jun 11", value: 149700 },
  { date: "Jun 13", value: 155100 },
  { date: "Jun 15", value: 158900 },
  { date: "Jun 17", value: 157200 },
  { date: "Jun 19", value: 161450 },
  { date: "Jun 21", value: 163540 },
];

const totalValue = PORTFOLIO_HOLDINGS.reduce((s, h) => s + h.valueUsd, 0);
const totalPnl = PORTFOLIO_HOLDINGS.reduce((s, h) => s + h.pnlUsd, 0);
const totalPnlPct = (totalPnl / (totalValue - totalPnl)) * 100;

const allocationData = [
  { name: "Crypto", value: 75, fill: "#5B5FEF" },
  { name: "Forex", value: 25, fill: "#22D3C7" },
];

function StatCard({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <Card>
      <CardBody className="pt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{label}</p>
        <p className="mt-2 font-display text-2xl font-semibold text-ink tabular">{value}</p>
        {sub && (
          <p
            className={`mt-1 flex items-center gap-1 text-sm font-medium ${
              positive === undefined
                ? "text-ink-muted"
                : positive
                ? "text-gain"
                : "text-loss"
            }`}
          >
            {positive !== undefined &&
              (positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />)}
            {sub}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

interface TooltipPayload {
  value: number;
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-void-border bg-void-card px-3 py-2 shadow-card">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="font-mono text-sm font-semibold text-ink">
          {formatUsd(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function DashboardView() {
  const topSignals = AI_SIGNALS.slice(0, 3);

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            Welcome back. Markets are open — 3 active signals.
          </p>
        </div>
        <Link href="/assistant">
          <Button size="sm" className="gap-2">
            <Zap size={14} />
            New Signal
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Portfolio"
          value={formatUsd(totalValue, { compact: true })}
          sub="All positions"
        />
        <StatCard
          label="Total P&L"
          value={formatUsd(totalPnl)}
          sub={formatPercent(totalPnlPct)}
          positive={totalPnl >= 0}
        />
        <StatCard
          label="Available Cash"
          value={formatUsd(18420.32)}
          sub="Ready to deploy"
        />
        <StatCard
          label="Open Positions"
          value={String(PORTFOLIO_HOLDINGS.length)}
          sub="Across 2 markets"
        />
      </div>

      {/* P&L chart + allocation */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
            <Badge tone="success" dot>
              +{formatPercent(totalPnlPct)} all time
            </Badge>
          </CardHeader>
          <CardBody className="pt-3">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={PNL_HISTORY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B5FEF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5B5FEF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2438" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#8389A6", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fill: "#8389A6", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#5B5FEF"
                  strokeWidth={2}
                  fill="url(#pnlGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allocation</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col items-center pt-2">
            <RadialBarChart
              width={160}
              height={160}
              cx={80}
              cy={80}
              innerRadius={50}
              outerRadius={75}
              data={allocationData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={6} />
            </RadialBarChart>
            <div className="mt-2 space-y-2">
              {allocationData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: d.fill }}
                  />
                  <span className="text-ink-muted">{d.name}</span>
                  <span className="ml-auto font-mono font-medium text-ink">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Holdings table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <Link href="/markets" className="flex items-center gap-1 text-xs text-signal-indigo hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </CardHeader>
        <CardBody className="pt-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-void-border text-xs font-medium uppercase tracking-wider text-ink-muted">
                  <th className="pb-3 text-left">Asset</th>
                  <th className="pb-3 text-right">Price</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right hidden md:table-cell">Value</th>
                  <th className="pb-3 text-right">P&L</th>
                  <th className="pb-3 text-right hidden lg:table-cell">7D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-void-border">
                {PORTFOLIO_HOLDINGS.map((h) => (
                  <tr key={h.symbol} className="group hover:bg-void-card2/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-void-card2 text-xs font-bold text-signal-indigo">
                          {h.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-ink">{h.symbol}</p>
                          <p className="text-xs text-ink-muted capitalize">{h.assetClass}</p>
                        </div>
                        {h.locked && (
                          <span className="ml-1 rounded-sm bg-amber-500/10 px-1 text-xs text-amber-400">
                            In trade
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono text-ink">
                      {formatUsd(h.currentPrice)}
                    </td>
                    <td className="py-3 text-right font-mono text-ink-muted">
                      {h.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </td>
                    <td className="py-3 text-right font-mono text-ink hidden md:table-cell">
                      {formatUsd(h.valueUsd)}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`font-mono font-medium ${
                          h.pnlUsd >= 0 ? "text-gain" : "text-loss"
                        }`}
                      >
                        {h.pnlUsd >= 0 ? "+" : ""}
                        {formatUsd(h.pnlUsd)}
                      </span>
                      <p
                        className={`text-xs ${
                          h.pnlPercent >= 0 ? "text-gain" : "text-loss"
                        }`}
                      >
                        {formatPercent(h.pnlPercent)}
                      </p>
                    </td>
                    <td className="py-3 hidden lg:table-cell w-24">
                      <Sparkline
                        data={Array.from({ length: 12 }, (_, i) =>
                          h.currentPrice * (1 + (Math.sin(i * 0.8) * 0.03))
                        )}
                        positive={h.pnlPercent >= 0}
                        height={32}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* AI Signals preview + Risk + Sentiment */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* AI Signals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-signal-violet" />
              <CardTitle>Latest AI Signals</CardTitle>
            </div>
            <Link href="/assistant" className="flex items-center gap-1 text-xs text-signal-indigo hover:underline">
              All signals <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardBody className="space-y-3 pt-3">
            {topSignals.map((sig) => (
              <div
                key={sig.id}
                className="rounded-xl border border-void-border bg-void-card2 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-ink">{sig.symbol}</span>
                    <Badge tone={signalTone(sig.action)}>{sig.action}</Badge>
                    <span className="text-xs text-ink-muted">{sig.timeframe}</span>
                  </div>
                  <span className="shrink-0 text-xs text-ink-muted">{timeAgo(sig.generatedAt)}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-ink-muted">Entry</p>
                    <p className="font-mono font-medium text-ink">{formatUsd(sig.entryPrice)}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted">Stop Loss</p>
                    <p className="font-mono font-medium text-loss">{formatUsd(sig.stopLoss)}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted">Take Profit</p>
                    <p className="font-mono font-medium text-gain">{formatUsd(sig.takeProfit)}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <ConfidenceRibbon confidence={sig.confidence} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Risk management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-signal-violet" />
              <CardTitle>Risk Controls</CardTitle>
            </div>
          </CardHeader>
          <CardBody className="space-y-5 pt-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-ink-muted">Daily Loss Limit</span>
                <span className="font-mono text-ink">
                  {formatUsd(DAILY_LOSS_USED_USD)} / {formatUsd(DAILY_LOSS_LIMIT_USD)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-void-card2">
                <div
                  className="h-2 rounded-full bg-amber-400 transition-all"
                  style={{ width: `${(DAILY_LOSS_USED_USD / DAILY_LOSS_LIMIT_USD) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {((DAILY_LOSS_USED_USD / DAILY_LOSS_LIMIT_USD) * 100).toFixed(0)}% of daily limit used
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-ink-muted">Max Drawdown</span>
                <span className="font-mono text-ink">
                  {CURRENT_DRAWDOWN_PCT}% / {MAX_DRAWDOWN_LIMIT_PCT}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-void-card2">
                <div
                  className="h-2 rounded-full bg-gain transition-all"
                  style={{ width: `${(CURRENT_DRAWDOWN_PCT / MAX_DRAWDOWN_LIMIT_PCT) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-ink-muted">Well within limits</p>
            </div>

            <div className="space-y-2 rounded-xl border border-void-border bg-void-card2 p-3">
              {[
                { label: "Trading Mode", value: "Paper Trading" },
                { label: "Max Position Size", value: "5% of portfolio" },
                { label: "Auto Stop-Loss", value: "Enabled" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-ink-muted">{r.label}</span>
                  <span className="font-medium text-ink">{r.value}</span>
                </div>
              ))}
            </div>

            {/* Sentiment bar chart */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-muted">
                AI Market Sentiment
              </p>
              <div className="space-y-1.5">
                {SENTIMENT_TREND.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-xs">
                    <span className="w-6 text-ink-muted">{s.label}</span>
                    <div className="flex-1 rounded-full bg-void-card2 h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-signal-gradient"
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-ink-muted">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
