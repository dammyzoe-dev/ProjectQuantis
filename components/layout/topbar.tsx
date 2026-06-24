"use client";

import { Bell, Menu, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { CRYPTO_ASSETS, FOREX_ASSETS } from "@/lib/mock-data";
import { formatPercent } from "@/lib/utils";

const TICKER_ASSETS = [
  ...CRYPTO_ASSETS.slice(0, 4),
  ...FOREX_ASSETS.slice(0, 3),
];

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-void-border bg-void-panel/80 backdrop-blur px-4">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-ink-muted hover:bg-void-card2 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Live ticker */}
      <div className="flex min-w-0 flex-1 items-center overflow-hidden">
        <div className="relative flex overflow-hidden">
          <div className="flex animate-ticker items-center gap-6 whitespace-nowrap pr-6">
            {[...TICKER_ASSETS, ...TICKER_ASSETS].map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="font-mono text-ink-muted">{a.symbol}</span>
                <span className="font-mono font-semibold text-ink">
                  {a.assetClass === "crypto" && a.price > 1
                    ? `$${a.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
                    : a.price.toFixed(4)}
                </span>
                <span
                  className={`flex items-center gap-0.5 font-mono ${
                    a.changePercent24h >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {a.changePercent24h >= 0 ? (
                    <TrendingUp size={10} />
                  ) : (
                    <TrendingDown size={10} />
                  )}
                  {formatPercent(a.changePercent24h)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-full border border-gain/30 bg-gain/10 px-3 py-1 text-xs font-medium text-gain sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-gain" />
          Live
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-md p-2 text-ink-muted hover:bg-void-card2 hover:text-ink"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-signal-violet" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-void-border bg-void-card shadow-card">
              <div className="border-b border-void-border px-4 py-3">
                <p className="text-sm font-semibold text-ink">Notifications</p>
              </div>
              {[
                { text: "BUY signal on BTC — 84% confidence", time: "6m ago", dot: "bg-gain" },
                { text: "SOL stop-loss order triggered at $179.10", time: "22m ago", dot: "bg-loss" },
                { text: "Binance API key synced successfully", time: "2h ago", dot: "bg-signal-indigo" },
              ].map((n, i) => (
                <div key={i} className="flex gap-3 px-4 py-3 hover:bg-void-card2">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                  <div>
                    <p className="text-sm text-ink">{n.text}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-gradient text-sm font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}
