"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  LineChart,
  Wallet,
  KeyRound,
  Settings,
  ShieldCheck,
  X,
  BadgeCheck,
  LogOut,
  CandlestickChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles },
  { href: "/markets", label: "Markets", icon: LineChart },
  { href: "/trading", label: "Trading", icon: CandlestickChart },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/api-management", label: "API Management", icon: KeyRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient font-display text-sm font-bold text-white shadow-glow">
            Q
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Quantis
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink-muted hover:bg-void-card2 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* KYC status banner */}
      <Link
        href="/kyc"
        onClick={onClose}
        className="mx-3 mb-3 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2.5 transition-colors hover:bg-amber-500/12"
      >
        <BadgeCheck size={15} className="shrink-0 text-amber-400" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-amber-400">Verify your identity</p>
          <p className="truncate text-xs text-amber-400/70">Complete KYC to unlock withdrawals</p>
        </div>
        <span className="ml-auto shrink-0 text-xs text-amber-400">→</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-void-card2 text-ink"
                  : "text-ink-muted hover:bg-void-card2 hover:text-ink"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0",
                  active
                    ? "text-signal-indigo"
                    : "text-ink-faint group-hover:text-ink-muted"
                )}
                size={18}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-signal-indigo" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mx-3 mb-3 space-y-2">
        {/* Trading mode badge */}
        <div className="rounded-xl border border-void-border bg-void-card2 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gain">
            <ShieldCheck size={13} />
            Paper trading mode
          </div>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Simulated funds — no real money at risk.
          </p>
        </div>

        {/* User + sign out */}
        <div className="flex items-center gap-2 rounded-xl border border-void-border bg-void-card2 px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal-gradient text-xs font-bold text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-ink">Alex Trader</p>
            <p className="truncate text-xs text-ink-muted">alex@example.com</p>
          </div>
          <Link
            href="/auth/login"
            className="shrink-0 rounded-md p-1.5 text-ink-faint hover:bg-void-borderLight hover:text-ink-muted"
            title="Sign out"
          >
            <LogOut size={14} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-void-border bg-void-panel lg:flex lg:flex-col">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-void-border bg-void-panel">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
