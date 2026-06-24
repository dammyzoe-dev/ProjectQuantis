"use client";

import { useState } from "react";
import {
  KeyRound, Plus, Trash2, RefreshCw, Eye, EyeOff,
  X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Lock,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONNECTED_ACCOUNTS } from "@/lib/mock-portfolio";
import { ConnectedAccount } from "@/types";
import { cn, timeAgo } from "@/lib/utils";

const STATUS_ICON = {
  connected: <CheckCircle2 size={15} className="text-gain" />,
  disconnected: <XCircle size={15} className="text-ink-muted" />,
  error: <AlertTriangle size={15} className="text-amber-400" />,
};

const STATUS_BADGE = {
  connected: "success" as const,
  disconnected: "neutral" as const,
  error: "warning" as const,
};

const PROVIDER_OPTIONS = [
  { label: "Binance", type: "exchange" },
  { label: "Bybit", type: "exchange" },
  { label: "OKX", type: "exchange" },
  { label: "Kraken", type: "exchange" },
  { label: "OANDA", type: "broker" },
  { label: "Interactive Brokers", type: "broker" },
];

function AccountCard({ account }: { account: ConnectedAccount }) {
  const [showKey, setShowKey] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const sync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  return (
    <Card className={cn(account.status === "error" && "border-amber-500/30")}>
      <CardBody className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ background: account.logoColor + "22", border: `1px solid ${account.logoColor}44` }}
            >
              <span style={{ color: account.logoColor }}>{account.provider.slice(0, 2)}</span>
            </div>
            <div>
              <p className="font-medium text-ink">{account.provider}</p>
              <p className="text-xs capitalize text-ink-muted">{account.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {STATUS_ICON[account.status]}
            <Badge tone={STATUS_BADGE[account.status]}>{account.status}</Badge>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-void-card2 px-3 py-2 text-xs">
            <span className="text-ink-muted">API Key</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-ink">
                {showKey ? "sk_live_Kv9m...3P4r" : "•••••••••••••••••••"}
              </span>
              <button onClick={() => setShowKey(!showKey)} className="text-ink-muted hover:text-ink">
                {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-void-card2 px-3 py-2">
              <p className="text-ink-muted">Permission</p>
              <p className="mt-0.5 font-medium capitalize text-ink">{account.permission}</p>
            </div>
            <div className="rounded-lg bg-void-card2 px-3 py-2">
              <p className="text-ink-muted">Last sync</p>
              <p className="mt-0.5 font-medium text-ink">{timeAgo(account.lastSync)}</p>
            </div>
          </div>

          {account.status === "error" && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400">
              API key may be expired or permissions changed. Please reconnect.
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 text-xs"
              onClick={sync}
              disabled={syncing || account.status === "disconnected"}
            >
              <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync"}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-loss hover:text-loss">
              <Trash2 size={12} />
              Remove
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function AddApiModal({ onClose }: { onClose: () => void }) {
  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secret, setSecret] = useState("");
  const [permission, setPermission] = useState<"read-only" | "trade">("read-only");
  const [showSecret, setShowSecret] = useState(false);
  const [added, setAdded] = useState(false);

  const submit = () => {
    setAdded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-void-border bg-void-card shadow-glow">
        <div className="flex items-center justify-between border-b border-void-border px-6 py-4">
          <div className="flex items-center gap-2">
            <KeyRound size={16} className="text-signal-indigo" />
            <span className="font-display font-semibold text-ink">Connect Exchange / Broker</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-ink-muted hover:bg-void-card2"><X size={18} /></button>
        </div>

        {!added ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-ink-muted">Provider</label>
              <div className="relative">
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 text-sm text-ink focus:border-signal-indigo focus:outline-none"
                >
                  <option value="">Select provider...</option>
                  {PROVIDER_OPTIONS.map((p) => (
                    <option key={p.label} value={p.label}>{p.label} ({p.type})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">API Key</label>
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key here"
                className="w-full rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 font-mono text-xs text-ink placeholder:text-ink-faint focus:border-signal-indigo focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">API Secret</label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Paste your API secret"
                  className="w-full rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 font-mono text-xs text-ink placeholder:text-ink-faint focus:border-signal-indigo focus:outline-none pr-10"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-3 text-ink-muted hover:text-ink"
                >
                  {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-ink-muted">Permission level</label>
              <div className="grid grid-cols-2 gap-2">
                {(["read-only", "trade"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPermission(p)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left text-xs transition-colors",
                      permission === p
                        ? "border-signal-indigo bg-signal-indigo/10"
                        : "border-void-border hover:border-void-borderLight"
                    )}
                  >
                    <p className={cn("font-medium", permission === p ? "text-signal-indigo" : "text-ink")}>
                      {p === "read-only" ? "Read-only" : "Trade access"}
                    </p>
                    <p className="mt-0.5 text-ink-muted">
                      {p === "read-only" ? "View balances & positions" : "Place & manage orders"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-signal-indigo/20 bg-signal-indigo/5 p-3 text-xs text-signal-indigo/80">
              <Lock size={13} className="mt-0.5 shrink-0" />
              Your API credentials are encrypted with AES-256. Withdrawals are never enabled regardless of key scope.
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={submit}
              disabled={!provider || !apiKey || !secret}
            >
              <ShieldCheck size={16} />
              Connect Securely
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-gradient">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">{provider} connected</p>
              <p className="mt-1 text-sm text-ink-muted">
                Your account is syncing. It will appear in the list momentarily.
              </p>
            </div>
            <Button variant="secondary" className="w-full" onClick={onClose}>Done</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ApiManagementView() {
  const [showAdd, setShowAdd] = useState(false);
  const exchanges = CONNECTED_ACCOUNTS.filter((a) => a.type === "exchange");
  const brokers = CONNECTED_ACCOUNTS.filter((a) => a.type === "broker");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">API Management</h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            Connect exchanges and brokers securely. No withdrawal permissions are ever enabled.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} />
          Add Connection
        </Button>
      </div>

      {/* Security info bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-signal-indigo/20 bg-signal-indigo/5 px-5 py-3.5">
        <ShieldCheck size={16} className="text-signal-indigo" />
        <p className="text-sm text-ink-muted">
          All API credentials are encrypted at rest with AES-256.{" "}
          <span className="text-ink">Withdrawal permissions are never requested or stored.</span>{" "}
          Use read-only keys for maximum safety.
        </p>
      </div>

      {/* Exchange connections */}
      <div>
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Exchanges
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {exchanges.map((a) => <AccountCard key={a.id} account={a} />)}
        </div>
      </div>

      {/* Broker connections */}
      <div>
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Forex Brokers
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {brokers.map((a) => <AccountCard key={a.id} account={a} />)}
        </div>
      </div>

      {/* Audit log preview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Log</CardTitle>
          <span className="text-xs text-ink-muted">All actions are logged immutably</span>
        </CardHeader>
        <CardBody className="pt-3">
          <div className="space-y-0 divide-y divide-void-border">
            {[
              { action: "API key synced", provider: "Binance", time: "2m ago", status: "success" },
              { action: "Order placed via API", provider: "OANDA", time: "18m ago", status: "success" },
              { action: "API key rotation triggered", provider: "Bybit", time: "2h ago", status: "warning" },
              { action: "Connection error detected", provider: "Kraken", time: "3h ago", status: "error" },
              { action: "New API key added", provider: "Binance", time: "1d ago", status: "success" },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-3 py-3 text-xs">
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    log.status === "success" ? "bg-gain"
                    : log.status === "warning" ? "bg-amber-400"
                    : "bg-loss"
                  )}
                />
                <span className="flex-1 text-ink">{log.action}</span>
                <span className="text-ink-muted">{log.provider}</span>
                <span className="text-ink-faint">{log.time}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {showAdd && <AddApiModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
