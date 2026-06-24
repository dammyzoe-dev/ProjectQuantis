"use client";

import { useState } from "react";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/sparkline";
import { ALL_ASSETS, AI_SIGNALS } from "@/lib/mock-data";
import { MarketAsset } from "@/types";
import { formatUsd, formatPercent, formatCompactVolume, cn } from "@/lib/utils";

function AssetRow({
  asset,
  starred,
  onToggleStar,
  onSelect,
  selected,
}: {
  asset: MarketAsset;
  starred: boolean;
  onToggleStar: () => void;
  onSelect: () => void;
  selected: boolean;
}) {
  const sig = AI_SIGNALS.find((s) => s.symbol === asset.symbol);
  const positive = asset.changePercent24h >= 0;

  return (
    <tr
      onClick={onSelect}
      className={cn(
        "group cursor-pointer border-b border-void-border text-sm transition-colors hover:bg-void-card2/50",
        selected && "bg-void-card2"
      )}
    >
      <td className="py-3 pl-4">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
          className="text-ink-faint hover:text-amber-400"
        >
          <Star size={14} fill={starred ? "#F59E0B" : "none"} color={starred ? "#F59E0B" : undefined} />
        </button>
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-void-card2 text-xs font-bold text-signal-indigo">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-ink">{asset.symbol}</p>
            <p className="text-xs text-ink-muted">{asset.name}</p>
          </div>
        </div>
      </td>
      <td className="py-3 text-right font-mono font-semibold text-ink pr-4">
        {formatUsd(asset.price)}
      </td>
      <td className={`py-3 text-right font-mono pr-4 ${positive ? "text-gain" : "text-loss"}`}>
        <div className="flex items-center justify-end gap-1">
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {formatPercent(asset.changePercent24h)}
        </div>
      </td>
      <td className="py-3 text-right font-mono text-xs text-ink-muted pr-4 hidden md:table-cell">
        {asset.volume24h ? `$${formatCompactVolume(asset.volume24h)}` : "—"}
      </td>
      <td className="py-3 hidden lg:table-cell pr-4">
        <Sparkline data={asset.sparkline} positive={positive} height={32} />
      </td>
      <td className="py-3 pr-4">
        {sig ? (
          <Badge tone={sig.action === "BUY" ? "buy" : sig.action === "SELL" ? "sell" : "hold"}>
            {sig.action}
          </Badge>
        ) : (
          <span className="text-xs text-ink-faint">—</span>
        )}
      </td>
    </tr>
  );
}

const DETAIL_HISTORY = (base: number, vol: number) =>
  Array.from({ length: 30 }, (_, i) => ({
    day: `D${i + 1}`,
    value: base + Math.sin(i * 0.4) * vol + i * vol * 0.04,
  }));

export function MarketsView() {
  const [tab, setTab] = useState<"all" | "crypto" | "forex">("all");
  const [starred, setStarred] = useState<Set<string>>(new Set(["BTC", "ETH", "EUR/USD"]));
  const [selected, setSelected] = useState<MarketAsset>(ALL_ASSETS[0]);

  const visible = ALL_ASSETS.filter(
    (a) => tab === "all" || a.assetClass === tab
  );

  const toggleStar = (sym: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(sym)) {
        next.delete(sym);
      } else {
        next.add(sym);
      }
      return next;
    });
  };

  const sig = AI_SIGNALS.find((s) => s.symbol === selected.symbol);
  const positive = selected.changePercent24h >= 0;
  const detailData = DETAIL_HISTORY(selected.price, selected.price * 0.03);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Markets</h1>
          <p className="mt-0.5 text-sm text-ink-muted">Live prices across crypto and forex</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-void-border bg-void-card2 p-1">
          {(["all", "crypto", "forex"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-xs font-medium capitalize transition-colors",
                tab === t
                  ? "bg-signal-gradient text-white"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Asset table */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-void-border text-xs font-medium uppercase tracking-wider text-ink-muted">
                  <th className="py-3 pl-4 text-left w-8"></th>
                  <th className="py-3 text-left">Asset</th>
                  <th className="py-3 text-right pr-4">Price</th>
                  <th className="py-3 text-right pr-4">24h</th>
                  <th className="py-3 text-right pr-4 hidden md:table-cell">Volume</th>
                  <th className="py-3 text-left hidden lg:table-cell pr-4">7D Chart</th>
                  <th className="py-3 text-left pr-4">Signal</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => (
                  <AssetRow
                    key={a.symbol}
                    asset={a}
                    starred={starred.has(a.symbol)}
                    onToggleStar={() => toggleStar(a.symbol)}
                    onSelect={() => setSelected(a)}
                    selected={selected.symbol === a.symbol}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <p className="font-display text-lg font-semibold text-ink">{selected.symbol}</p>
                <p className="text-xs text-ink-muted">{selected.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xl font-bold text-ink">
                  {formatUsd(selected.price)}
                </p>
                <p className={`text-sm font-mono ${positive ? "text-gain" : "text-loss"}`}>
                  {formatPercent(selected.changePercent24h)} today
                </p>
              </div>
            </CardHeader>
            <CardBody className="pt-3">
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={detailData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={positive ? "#22D3C7" : "#F0426B"} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={positive ? "#22D3C7" : "#F0426B"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2438" vertical={false} />
                  <YAxis
                    tickFormatter={(v) => formatUsd(v, { compact: true })}
                    tick={{ fill: "#8389A6", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                  />
                  <Tooltip
                    formatter={(v) => [formatUsd(Number(v)), "Price"]}
                    contentStyle={{ background: "#10131F", border: "1px solid #1F2438", borderRadius: 8 }}
                    labelStyle={{ color: "#8389A6", fontSize: 11 }}
                    itemStyle={{ color: "#E8EAF2", fontFamily: "var(--font-jetbrains)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={positive ? "#22D3C7" : "#F0426B"}
                    strokeWidth={2}
                    fill="url(#detailGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "24h High", value: formatUsd(selected.price * 1.025) },
                  { label: "24h Low", value: formatUsd(selected.price * 0.975) },
                  { label: "24h Change", value: formatUsd(Math.abs(selected.changeAbs24h)) },
                  { label: "Class", value: selected.assetClass.toUpperCase() },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-void-card2 px-3 py-2">
                    <p className="text-ink-muted">{s.label}</p>
                    <p className="mt-0.5 font-mono font-medium text-ink">{s.value}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {sig && (
            <Card>
              <CardHeader>
                <CardTitle>AI Signal</CardTitle>
                <Badge tone={sig.action === "BUY" ? "buy" : sig.action === "SELL" ? "sell" : "hold"}>
                  {sig.action}
                </Badge>
              </CardHeader>
              <CardBody className="space-y-3 pt-3">
                <p className="text-xs leading-relaxed text-ink-muted">
                  {sig.reasoning.technical}
                </p>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1 text-xs">
                    Execute Signal
                  </Button>
                  <Button variant="secondary" size="sm" className="text-xs">
                    Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
