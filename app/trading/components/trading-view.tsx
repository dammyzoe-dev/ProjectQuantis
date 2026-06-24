"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, CheckCircle2,
  XCircle, Zap, AlertTriangle, ChevronDown, X,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, signalTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceRibbon } from "@/components/ui/confidence-ribbon";
import { AI_SIGNALS, ALL_ASSETS } from "@/lib/mock-data";
import { formatUsd, formatPercent, cn, timeAgo } from "@/lib/utils";

// ─── Mock open orders ─────────────────────────────────────────────────────────
const OPEN_ORDERS = [
  {
    id: "ord-001", symbol: "BTC", side: "BUY" as const,
    type: "Limit", qty: 0.05, price: 71000, filled: 0,
    status: "open", createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    exchange: "Binance",
  },
  {
    id: "ord-002", symbol: "XAU/USD", side: "BUY" as const,
    type: "Market", qty: 3, price: 2342.8, filled: 3,
    status: "filled", createdAt: new Date(Date.now() - 32 * 60000).toISOString(),
    exchange: "OANDA",
  },
  {
    id: "ord-003", symbol: "SOL", side: "SELL" as const,
    type: "Stop", qty: 20, price: 179.1, filled: 20,
    status: "filled", createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    exchange: "Binance",
  },
  {
    id: "ord-004", symbol: "GBP/USD", side: "SELL" as const,
    type: "Limit", qty: 10000, price: 1.271, filled: 0,
    status: "open", createdAt: new Date(Date.now() - 55 * 60000).toISOString(),
    exchange: "OANDA",
  },
  {
    id: "ord-005", symbol: "ETH", side: "BUY" as const,
    type: "Limit", qty: 0.8, price: 3780, filled: 0,
    status: "cancelled", createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    exchange: "Bybit",
  },
];

// Pending approval queue for semi-auto mode
const APPROVAL_QUEUE = AI_SIGNALS.filter(
  (s) => s.action !== "HOLD"
).slice(0, 2);

// Simple price chart data
const chartData = (base: number) =>
  Array.from({ length: 30 }, (_, i) => ({
    t: `${i + 1}`,
    v: base * (1 + Math.sin(i * 0.5) * 0.025 + i * 0.001),
  }));

const STATUS_BADGE = {
  open: { tone: "hold" as const, label: "Open" },
  filled: { tone: "success" as const, label: "Filled" },
  cancelled: { tone: "neutral" as const, label: "Cancelled" },
};

// ─── Quick Trade Panel ────────────────────────────────────────────────────────
function QuickTradePanel() {
  const [asset, setAsset] = useState("BTC");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [submitted, setSubmitted] = useState(false);

  const found = ALL_ASSETS.find((a) => a.symbol === asset);
  const estTotal =
    parseFloat(amount || "0") * (orderType === "market" ? (found?.price ?? 0) : parseFloat(price || "0"));

  const handleSubmit = () => {
    if (!amount) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Trade</CardTitle>
        <Badge tone="hold" dot>Semi-auto mode</Badge>
      </CardHeader>
      <CardBody className="space-y-4 pt-4">
        {/* Asset picker */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Asset</label>
          <div className="relative">
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full appearance-none rounded-xl border border-void-border bg-void-card2 px-4 py-2.5 text-sm text-ink focus:border-signal-indigo focus:outline-none"
            >
              {ALL_ASSETS.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol} — {formatUsd(a.price)}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-ink-muted" />
          </div>
        </div>

        {/* Side toggle */}
        <div className="grid grid-cols-2 gap-2">
          {(["BUY", "SELL"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={cn(
                "rounded-xl py-2.5 text-sm font-semibold transition-all",
                side === s
                  ? s === "BUY"
                    ? "bg-gain text-void shadow-glow-teal"
                    : "bg-loss text-white"
                  : "border border-void-border bg-void-card2 text-ink-muted hover:text-ink"
              )}
            >
              {s === "BUY" ? <TrendingUp className="inline mr-1.5" size={14} /> : <TrendingDown className="inline mr-1.5" size={14} />}
              {s}
            </button>
          ))}
        </div>

        {/* Order type */}
        <div className="flex gap-1 rounded-xl border border-void-border bg-void-card2 p-1">
          {(["market", "limit", "stop"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-xs font-medium capitalize transition-colors",
                orderType === t
                  ? "bg-void-panel text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            Quantity ({asset.includes("/") ? "units" : asset})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-void-border bg-void-card2 px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-signal-indigo focus:outline-none"
          />
        </div>

        {/* Price (limit/stop only) */}
        {orderType !== "market" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">
              {orderType === "limit" ? "Limit price" : "Stop price"} (USD)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={formatUsd(found?.price ?? 0).replace("$", "")}
              className="w-full rounded-xl border border-void-border bg-void-card2 px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-signal-indigo focus:outline-none"
            />
          </div>
        )}

        {/* Slippage (market only) */}
        {orderType === "market" && (
          <div>
            <div className="flex justify-between mb-1.5 text-xs">
              <label className="font-medium text-ink-muted">Max slippage</label>
              <span className="font-mono text-ink">{slippage}%</span>
            </div>
            <div className="flex gap-2">
              {["0.1", "0.5", "1.0", "2.0"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={cn(
                    "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors",
                    slippage === s
                      ? "border-signal-indigo bg-signal-indigo/10 text-signal-indigo"
                      : "border-void-border text-ink-muted hover:text-ink"
                  )}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Est. total */}
        <div className="rounded-xl border border-void-border bg-void-card2 px-4 py-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-ink-muted">Est. order value</span>
            <span className="font-mono font-semibold text-ink">{formatUsd(estTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Trading fee (~0.1%)</span>
            <span className="font-mono text-ink-muted">{formatUsd(estTotal * 0.001)}</span>
          </div>
        </div>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-gain/30 bg-gain/10 py-3 text-sm font-semibold text-gain">
            <CheckCircle2 size={16} />
            Order submitted for review
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!amount}
            className={cn(
              "w-full",
              side === "SELL" && "bg-loss hover:brightness-110 shadow-none"
            )}
            size="lg"
          >
            {side === "BUY" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            Place {side} Order
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

// ─── Approval Queue Card ──────────────────────────────────────────────────────
function ApprovalQueue() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [approved, setApproved] = useState<Set<string>>(new Set());

  const visible = APPROVAL_QUEUE.filter((s) => !dismissed.has(s.id));

  if (visible.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Approval Queue</CardTitle></CardHeader>
        <CardBody className="pt-3">
          <div className="flex h-20 items-center justify-center text-sm text-ink-muted">
            No pending signals awaiting approval.
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap size={15} className="text-signal-violet" />
          <CardTitle>Approval Queue</CardTitle>
        </div>
        <Badge tone="warning" dot>{visible.length} pending</Badge>
      </CardHeader>
      <CardBody className="space-y-3 pt-3">
        {visible.map((sig) => (
          <div
            key={sig.id}
            className={cn(
              "rounded-xl border p-4 transition-all",
              approved.has(sig.id)
                ? "border-gain/30 bg-gain/5"
                : "border-void-border bg-void-card2"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-ink">{sig.symbol}</span>
                  <Badge tone={signalTone(sig.action)}>{sig.action}</Badge>
                  <span className="text-xs text-ink-muted">{sig.timeframe}</span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  Entry {formatUsd(sig.entryPrice)} · SL {formatUsd(sig.stopLoss)} · TP {formatUsd(sig.takeProfit)}
                </p>
              </div>
              <button
                onClick={() => setDismissed((d) => new Set([...d, sig.id]))}
                className="shrink-0 rounded-md p-1 text-ink-faint hover:bg-void-border hover:text-ink-muted"
              >
                <X size={13} />
              </button>
            </div>
            <div className="mt-3">
              <ConfidenceRibbon confidence={sig.confidence} />
            </div>
            {!approved.has(sig.id) ? (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setApproved((a) => new Set([...a, sig.id]))}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gain/10 py-2 text-xs font-semibold text-gain hover:bg-gain/15 transition-colors"
                >
                  <CheckCircle2 size={13} /> Approve
                </button>
                <button
                  onClick={() => setDismissed((d) => new Set([...d, sig.id]))}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-loss/10 py-2 text-xs font-semibold text-loss hover:bg-loss/15 transition-colors"
                >
                  <XCircle size={13} /> Reject
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-gain/30 bg-gain/5 py-2 text-xs font-semibold text-gain">
                <CheckCircle2 size={13} /> Approved — order queued
              </div>
            )}
          </div>
        ))}

        <p className="text-center text-xs text-ink-muted">
          You&apos;re in <span className="text-ink">Semi-auto mode</span> — all signals require your approval before execution.
        </p>
      </CardBody>
    </Card>
  );
}

// ─── Main Trading View ────────────────────────────────────────────────────────
export function TradingView() {
  const [orderFilter, setOrderFilter] = useState<"all" | "open" | "filled" | "cancelled">("all");
  const [selectedAsset] = useState(ALL_ASSETS[0]);
  const data = chartData(selectedAsset.price);

  const filtered = OPEN_ORDERS.filter(
    (o) => orderFilter === "all" || o.status === orderFilter
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Trading</h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            Execute trades, manage orders, and review AI-generated signals
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/8 px-3 py-1.5 text-xs font-medium text-amber-400">
          <AlertTriangle size={13} />
          Semi-auto · 2 signals awaiting approval
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: chart + orders */}
        <div className="space-y-5 lg:col-span-2">
          {/* Price chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-void-card2 text-xs font-bold text-signal-indigo">
                  {selectedAsset.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-display font-semibold text-ink">{selectedAsset.symbol}</p>
                  <p className="text-xs text-ink-muted">{selectedAsset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold text-ink">
                  {formatUsd(selectedAsset.price)}
                </p>
                <p className={`text-sm font-mono ${selectedAsset.changePercent24h >= 0 ? "text-gain" : "text-loss"}`}>
                  {formatPercent(selectedAsset.changePercent24h)} 24h
                </p>
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tradeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B5FEF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#5B5FEF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2438" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis
                    tickFormatter={(v) => formatUsd(v, { compact: true })}
                    tick={{ fill: "#8389A6", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                  />
                  <Tooltip
                    formatter={(v) => [formatUsd(Number(v)), "Price"]}
                    contentStyle={{ background: "#10131F", border: "1px solid #1F2438", borderRadius: 8 }}
                    labelStyle={{ display: "none" }}
                    itemStyle={{ color: "#E8EAF2", fontFamily: "var(--font-jetbrains)", fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="v" stroke="#5B5FEF" strokeWidth={2} fill="url(#tradeGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Orders table */}
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <div className="flex gap-1 rounded-xl border border-void-border bg-void-card2 p-1">
                {(["all", "open", "filled", "cancelled"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors",
                      orderFilter === f
                        ? "bg-void-panel text-ink"
                        : "text-ink-muted hover:text-ink"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardBody className="pt-3">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-void-border text-xs font-medium uppercase tracking-wider text-ink-muted">
                      <th className="pb-3 text-left">Asset</th>
                      <th className="pb-3 text-left">Side</th>
                      <th className="pb-3 text-left hidden sm:table-cell">Type</th>
                      <th className="pb-3 text-right">Qty</th>
                      <th className="pb-3 text-right hidden md:table-cell">Price</th>
                      <th className="pb-3 text-left pl-3">Status</th>
                      <th className="pb-3 text-right hidden lg:table-cell">Time</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-void-border">
                    {filtered.map((o) => (
                      <tr key={o.id} className="group hover:bg-void-card2/50">
                        <td className="py-3 font-medium text-ink">{o.symbol}</td>
                        <td className="py-3">
                          <span className={cn(
                            "flex items-center gap-1 text-xs font-semibold",
                            o.side === "BUY" ? "text-gain" : "text-loss"
                          )}>
                            {o.side === "BUY" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {o.side}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-ink-muted hidden sm:table-cell">{o.type}</td>
                        <td className="py-3 text-right font-mono text-xs text-ink">
                          {o.qty.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </td>
                        <td className="py-3 text-right font-mono text-xs text-ink hidden md:table-cell">
                          {formatUsd(o.price)}
                        </td>
                        <td className="py-3 pl-3">
                          <Badge tone={STATUS_BADGE[o.status as keyof typeof STATUS_BADGE].tone} dot>
                            {STATUS_BADGE[o.status as keyof typeof STATUS_BADGE].label}
                          </Badge>
                        </td>
                        <td className="py-3 text-right text-xs text-ink-muted hidden lg:table-cell">
                          {timeAgo(o.createdAt)}
                        </td>
                        <td className="py-3 text-right">
                          {o.status === "open" ? (
                            <button className="rounded-md px-2 py-1 text-xs text-loss hover:bg-loss/10 transition-colors">
                              Cancel
                            </button>
                          ) : (
                            <span className="text-xs text-ink-faint">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="flex h-20 items-center justify-center text-sm text-ink-muted">
                    No orders match the filter.
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right: trade panel + approval queue */}
        <div className="space-y-5">
          <QuickTradePanel />
          <ApprovalQueue />
        </div>
      </div>
    </div>
  );
}
