"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  X,
  Copy,
  QrCode,
  Check,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WALLET_BALANCES, TRANSACTIONS } from "@/lib/mock-portfolio";
import { Transaction } from "@/types";
import { formatUsd, cn, timeAgo } from "@/lib/utils";

const FAKE_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
const FAKE_ETH_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

const totalAvailable = WALLET_BALANCES.reduce((s, b) => s + b.usdValue * (b.available / (b.available + b.locked || 1)), 0);
const totalLocked = WALLET_BALANCES.reduce((s, b) => s + b.usdValue * (b.locked / (b.available + b.locked || 1)), 0);
const totalBalance = WALLET_BALANCES.reduce((s, b) => s + b.usdValue, 0);

function TxStatusBadge({ status }: { status: Transaction["status"] }) {
  const map = {
    completed: "success" as const,
    pending: "warning" as const,
    failed: "danger" as const,
  };
  return <Badge tone={map[status]} dot>{status}</Badge>;
}

// ─── Deposit Modal ────────────────────────────────────────────────────────────
function DepositModal({ onClose }: { onClose: () => void }) {
  const [method, setMethod] = useState<"crypto" | "bank" | "card">("crypto");
  const [asset, setAsset] = useState("BTC");
  const [copied, setCopied] = useState(false);

  const addr = asset === "ETH" || asset === "USDT" ? FAKE_ETH_ADDRESS : FAKE_ADDRESS;

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-void-border bg-void-card shadow-glow">
        <div className="flex items-center justify-between border-b border-void-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ArrowDownLeft size={18} className="text-gain" />
            <span className="font-display font-semibold text-ink">Deposit Funds</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-ink-muted hover:bg-void-card2"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Method tabs */}
          <div>
            <p className="mb-2 text-xs font-medium text-ink-muted">Deposit method</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: "crypto", label: "Crypto" },
                { key: "bank", label: "Bank Transfer" },
                { key: "card", label: "Card" },
              ] as const).map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={cn(
                    "rounded-xl border py-2.5 text-xs font-medium transition-colors",
                    method === m.key
                      ? "border-signal-indigo bg-signal-indigo/10 text-signal-indigo"
                      : "border-void-border text-ink-muted hover:border-void-borderLight hover:text-ink"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {method === "crypto" && (
            <>
              <div>
                <p className="mb-2 text-xs font-medium text-ink-muted">Select asset</p>
                <div className="flex gap-2">
                  {["BTC", "ETH", "USDT"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAsset(a)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium",
                        asset === a
                          ? "border-gain/40 bg-gain/10 text-gain"
                          : "border-void-border text-ink-muted"
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fake QR */}
              <div className="flex flex-col items-center gap-3 rounded-xl border border-void-border bg-void-card2 p-5">
                <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-void-borderLight text-ink-faint">
                  <QrCode size={48} />
                </div>
                <div className="w-full">
                  <p className="mb-1 text-xs text-ink-muted">Your {asset} deposit address</p>
                  <div className="flex items-center gap-2 rounded-lg border border-void-border bg-void-card px-3 py-2">
                    <span className="flex-1 truncate font-mono text-xs text-ink">{addr}</span>
                    <button onClick={copy} className="shrink-0 text-ink-muted hover:text-ink">
                      {copied ? <Check size={14} className="text-gain" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2 rounded-lg bg-gain/5 px-3 py-2 text-xs text-gain/80">
                  <ShieldCheck size={13} />
                  Only send {asset} to this address. No minimum deposit.
                </div>
              </div>
            </>
          )}

          {method === "bank" && (
            <div className="space-y-3 rounded-xl border border-void-border bg-void-card2 p-4 text-sm">
              {[
                { label: "Bank Name", value: "Quantis Financial Ltd." },
                { label: "Account Number", value: "••••••4821" },
                { label: "Sort Code / SWIFT", value: "QNTSGB2L" },
                { label: "Reference", value: "QT-USER-00189" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-ink-muted">{r.label}</span>
                  <span className="font-mono text-ink">{r.value}</span>
                </div>
              ))}
              <p className="mt-2 text-xs text-ink-muted">Processing time: 1–3 business days. No fees for wire transfers.</p>
            </div>
          )}

          {method === "card" && (
            <div className="space-y-3">
              {[
                { label: "Card Number", placeholder: "•••• •••• •••• ••••" },
                { label: "Expiry", placeholder: "MM / YY" },
                { label: "CVV", placeholder: "•••" },
                { label: "Amount (USD)", placeholder: "0.00" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1 block text-xs font-medium text-ink-muted">{f.label}</label>
                  <input
                    className="w-full rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-signal-indigo focus:outline-none"
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <p className="text-xs text-ink-muted">Card deposits incur a 0.3% processing fee. Instant confirmation.</p>
            </div>
          )}

          <Button className="w-full" size="lg">
            <ArrowDownLeft size={16} />
            Confirm Deposit
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Withdraw Modal ───────────────────────────────────────────────────────────
type WithdrawStep = "form" | "review" | "confirm";

function WithdrawModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<WithdrawStep>("form");
  const [asset, setAsset] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");

  const fee = asset === "USD" ? 15 : 0.0005;
  const net = parseFloat(amount || "0") - fee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-void-border bg-void-card shadow-glow">
        <div className="flex items-center justify-between border-b border-void-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ArrowUpRight size={18} className="text-loss" />
            <span className="font-display font-semibold text-ink">Withdraw Funds</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-ink-muted hover:bg-void-card2"><X size={18} /></button>
        </div>

        {/* Progress */}
        <div className="flex border-b border-void-border">
          {(["form", "review", "confirm"] as const).map((s, i) => (
            <div
              key={s}
              className={cn(
                "flex-1 py-2 text-center text-xs font-medium transition-colors",
                step === s ? "border-b-2 border-signal-indigo text-signal-indigo" : "text-ink-muted"
              )}
            >
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {step === "form" && (
            <>
              <div>
                <p className="mb-2 text-xs font-medium text-ink-muted">Asset</p>
                <div className="relative">
                  <select
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 text-sm text-ink focus:border-signal-indigo focus:outline-none"
                  >
                    {["BTC", "ETH", "USDT", "USD", "EUR"].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-ink-muted" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-signal-indigo focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">
                  Destination {asset === "USD" || asset === "EUR" ? "bank account" : "wallet address"}
                </label>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={asset === "USD" ? "Bank account •••• 4421" : "0x... or bc1..."}
                  className="w-full rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 font-mono text-xs text-ink placeholder:text-ink-faint focus:border-signal-indigo focus:outline-none"
                />
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
                KYC verification and 2FA required before withdrawal is processed.
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => setStep("review")}
                disabled={!amount || !destination}
              >
                Continue to Review
              </Button>
            </>
          )}

          {step === "review" && (
            <>
              <div className="space-y-3 rounded-xl border border-void-border bg-void-card2 p-4 text-sm">
                <p className="font-semibold text-ink">Transaction Summary</p>
                {[
                  { label: "Asset", value: asset },
                  { label: "Amount", value: `${amount} ${asset}` },
                  { label: "Network fee", value: `${fee} ${asset}` },
                  { label: "Net received", value: `${net > 0 ? net.toFixed(6) : "—"} ${asset}` },
                  { label: "Destination", value: destination.slice(0, 20) + "..." },
                  { label: "Est. processing", value: asset === "USD" ? "1–3 business days" : "~10 minutes" },
                ].map((r) => (
                  <div key={r.label} className={cn("flex justify-between text-xs", r.label === "Net received" && "border-t border-void-border pt-2 font-semibold")}>
                    <span className="text-ink-muted">{r.label}</span>
                    <span className="font-mono text-ink">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep("form")}>
                  Back
                </Button>
                <Button size="lg" className="flex-1" onClick={() => setStep("confirm")}>
                  Confirm
                </Button>
              </div>
            </>
          )}

          {step === "confirm" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-signal-gradient">
                <Check size={28} className="text-white" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-ink">Withdrawal submitted</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Your request is being processed. You&apos;ll receive an email confirmation.
                </p>
              </div>
              <Badge tone="warning" dot>Pending review</Badge>
              <Button variant="secondary" className="w-full" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Wallet View ─────────────────────────────────────────────────────────
export function WalletView() {
  const [modal, setModal] = useState<"deposit" | "withdraw" | null>(null);
  const [txFilter, setTxFilter] = useState<"all" | "deposit" | "withdrawal">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "failed">("all");

  const filteredTx = TRANSACTIONS.filter((t) => {
    if (txFilter !== "all" && t.type !== txFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Wallet</h1>
          <p className="mt-0.5 text-sm text-ink-muted">Manage deposits, withdrawals, and balances</p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" onClick={() => setModal("deposit")} className="gap-2">
            <ArrowDownLeft size={16} />
            Deposit
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setModal("withdraw")} className="gap-2">
            <ArrowUpRight size={16} />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Balance overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Portfolio", value: formatUsd(totalBalance), sub: "All assets combined" },
          { label: "Available Balance", value: formatUsd(totalAvailable), sub: "Ready to trade or withdraw", positive: true },
          { label: "Locked / In-Trade", value: formatUsd(totalLocked), sub: "In open positions" },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="pt-5">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{s.label}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">{s.value}</p>
              <p className="mt-1 text-xs text-ink-muted">{s.sub}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Asset balances table */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Balances</CardTitle>
        </CardHeader>
        <CardBody className="pt-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-void-border text-xs font-medium uppercase tracking-wider text-ink-muted">
                  <th className="pb-3 text-left">Asset</th>
                  <th className="pb-3 text-right">Available</th>
                  <th className="pb-3 text-right">Locked</th>
                  <th className="pb-3 text-right">USD Value</th>
                  <th className="pb-3 text-left pl-4">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-void-border">
                {WALLET_BALANCES.map((b) => (
                  <tr key={b.symbol} className="hover:bg-void-card2/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-void-card2 text-xs font-bold text-signal-indigo">
                          {b.symbol.slice(0, 2)}
                        </div>
                        <span className="font-medium text-ink">{b.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono text-ink">
                      {b.available.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </td>
                    <td className="py-3 text-right font-mono text-ink-muted">
                      {b.locked > 0 ? b.locked.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "—"}
                    </td>
                    <td className="py-3 text-right font-mono font-medium text-ink">
                      {formatUsd(b.usdValue)}
                    </td>
                    <td className="py-3 pl-4">
                      <Badge tone={b.assetClass === "crypto" ? "hold" : b.assetClass === "fiat" ? "neutral" : "success"}>
                        {b.assetClass}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardBody className="pt-3 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(["all", "deposit", "withdrawal"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTxFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                  txFilter === f
                    ? "border-signal-indigo bg-signal-indigo/10 text-signal-indigo"
                    : "border-void-border text-ink-muted hover:text-ink"
                )}
              >
                {f}
              </button>
            ))}
            <span className="w-px bg-void-border" />
            {(["all", "completed", "pending", "failed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                  statusFilter === f
                    ? f === "completed" ? "border-gain/40 bg-gain/10 text-gain"
                      : f === "pending" ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : f === "failed" ? "border-loss/40 bg-loss/10 text-loss"
                      : "border-signal-indigo bg-signal-indigo/10 text-signal-indigo"
                    : "border-void-border text-ink-muted hover:text-ink"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="divide-y divide-void-border">
            {filteredTx.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-muted">No transactions match the selected filters.</p>
            ) : filteredTx.map((tx) => (
              <div key={tx.id} className="flex flex-wrap items-center gap-3 py-4">
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  tx.type === "deposit" ? "bg-gain/10" : "bg-loss/10"
                )}>
                  {tx.type === "deposit"
                    ? <ArrowDownLeft size={16} className="text-gain" />
                    : <ArrowUpRight size={16} className="text-loss" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium capitalize text-ink">{tx.type}</span>
                    <span className="font-mono text-sm text-ink-muted">{tx.asset}</span>
                    <TxStatusBadge status={tx.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {tx.method}
                    {tx.destination ? ` · ${tx.destination}` : ""}
                    {" · "}{timeAgo(tx.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-mono font-semibold",
                    tx.type === "deposit" ? "text-gain" : "text-loss"
                  )}>
                    {tx.type === "deposit" ? "+" : "-"}{tx.amount.toLocaleString()} {tx.asset}
                  </p>
                  <p className="text-xs font-mono text-ink-muted">{formatUsd(tx.usdValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Modals */}
      {modal === "deposit" && <DepositModal onClose={() => setModal(null)} />}
      {modal === "withdraw" && <WithdrawModal onClose={() => setModal(null)} />}
    </div>
  );
}
