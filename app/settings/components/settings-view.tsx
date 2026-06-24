"use client";

import { useState } from "react";
import { Shield, Bell, Bot, User, Check } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TradingMode } from "@/types";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200",
        on ? "bg-signal-gradient" : "bg-void-card2"
      )}
      role="switch"
      aria-checked={on}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
          on ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-ink-muted">{label}</span>
        <span className="font-mono font-semibold text-ink">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-signal-indigo"
      />
      <div className="flex justify-between text-xs text-ink-faint">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}

const TRADING_MODES: { key: TradingMode; label: string; desc: string; color: string }[] = [
  { key: "paper", label: "Paper Trading", desc: "Simulated trades with no real money. Perfect for testing strategies.", color: "border-gain/40 bg-gain/5 text-gain" },
  { key: "suggestions", label: "AI Suggestions Only", desc: "Receive signals and execute them manually yourself.", color: "border-signal-indigo/40 bg-signal-indigo/5 text-signal-indigo" },
  { key: "semi-auto", label: "Semi-Automated", desc: "AI generates signals; you approve each trade before execution.", color: "border-signal-violet/40 bg-signal-violet/5 text-signal-violet" },
  { key: "full-auto", label: "Fully Automated", desc: "AI executes trades within your defined risk parameters automatically.", color: "border-amber-400/40 bg-amber-400/5 text-amber-400" },
];

export function SettingsView() {
  const [tradingMode, setTradingMode] = useState<TradingMode>("paper");
  const [dailyLossLimit, setDailyLossLimit] = useState(2500);
  const [maxDrawdown, setMaxDrawdown] = useState(15);
  const [maxPositionPct, setMaxPositionPct] = useState(5);
  const [autoStopLoss, setAutoStopLoss] = useState(true);
  const [autoTakeProfit, setAutoTakeProfit] = useState(true);
  const [twoFa, setTwoFa] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [signalNotifs, setSignalNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
          <p className="mt-0.5 text-sm text-ink-muted">Configure trading mode, risk limits, and notifications</p>
        </div>
        <Button size="sm" onClick={save}>
          {saved ? <><Check size={14} /> Saved</> : "Save Changes"}
        </Button>
      </div>

      {/* Trading Mode */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-signal-indigo" />
            <CardTitle>Trading Mode</CardTitle>
          </div>
        </CardHeader>
        <CardBody className="pt-4 grid gap-3 sm:grid-cols-2">
          {TRADING_MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setTradingMode(m.key)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                tradingMode === m.key
                  ? m.color
                  : "border-void-border bg-void-card2 hover:border-void-borderLight"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("font-medium", tradingMode === m.key ? "" : "text-ink")}>
                  {m.label}
                </span>
                {tradingMode === m.key && (
                  <Check size={14} className="shrink-0" />
                )}
              </div>
              <p className={cn("mt-1 text-xs leading-relaxed", tradingMode === m.key ? "opacity-80" : "text-ink-muted")}>
                {m.desc}
              </p>
            </button>
          ))}
          {tradingMode === "full-auto" && (
            <div className="col-span-full rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
              ⚠ Fully Automated mode will execute real trades within your risk limits. Ensure your risk controls are correctly set before enabling.
            </div>
          )}
        </CardBody>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-signal-violet" />
            <CardTitle>Risk Management</CardTitle>
          </div>
        </CardHeader>
        <CardBody className="pt-4 space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <RangeInput label="Daily Loss Limit (USD)" value={dailyLossLimit} onChange={setDailyLossLimit} min={100} max={10000} step={100} suffix="" />
            <RangeInput label="Max Drawdown (%)" value={maxDrawdown} onChange={setMaxDrawdown} min={5} max={50} suffix="%" />
            <RangeInput label="Max Position Size (% of portfolio)" value={maxPositionPct} onChange={setMaxPositionPct} min={1} max={20} suffix="%" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 border-t border-void-border pt-5">
            {[
              { label: "Auto Stop-Loss", desc: "Automatically set stop-loss on every trade", value: autoStopLoss, set: setAutoStopLoss },
              { label: "Auto Take-Profit", desc: "Automatically set take-profit targets on trades", value: autoTakeProfit, set: setAutoTakeProfit },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-xl border border-void-border bg-void-card2 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{f.label}</p>
                  <p className="text-xs text-ink-muted">{f.desc}</p>
                </div>
                <Toggle on={f.value} onChange={f.set} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-gain" />
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <CardBody className="pt-4 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-void-border bg-void-card2 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-ink-muted">Required for withdrawals and trade access API keys</p>
            </div>
            <Toggle on={twoFa} onChange={setTwoFa} />
          </div>
          {!twoFa && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
              Enable 2FA to unlock withdrawals and full-auto trading. This is strongly recommended.
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <Button variant="secondary" size="sm">Change Password</Button>
            <Button variant="secondary" size="sm">Set Withdrawal PIN</Button>
            <Button variant="secondary" size="sm">Download Audit Log</Button>
          </div>
        </CardBody>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-signal-indigo" />
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardBody className="pt-4 space-y-3">
          {[
            { label: "Email alerts", desc: "Trade confirmations and security notices", value: emailAlerts, set: setEmailAlerts },
            { label: "AI signal alerts", desc: "Get notified when new high-confidence signals are generated", value: signalNotifs, set: setSignalNotifs },
            { label: "Order fill notifications", desc: "Alerts when orders are executed or cancelled", value: orderNotifs, set: setOrderNotifs },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between rounded-xl border border-void-border bg-void-card2 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{f.label}</p>
                <p className="text-xs text-ink-muted">{f.desc}</p>
              </div>
              <Toggle on={f.value} onChange={f.set} />
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={16} className="text-ink-muted" />
            <CardTitle>Profile</CardTitle>
          </div>
        </CardHeader>
        <CardBody className="pt-4 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Display Name", placeholder: "Alex Trader" },
            { label: "Email", placeholder: "alex@example.com" },
            { label: "Base Currency", placeholder: "USD" },
            { label: "Timezone", placeholder: "UTC+0 (London)" },
          ].map((f) => (
            <div key={f.label}>
              <label className="mb-1 block text-xs font-medium text-ink-muted">{f.label}</label>
              <input
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-void-border bg-void-card2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-signal-indigo focus:outline-none"
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <div className="flex justify-end pb-4">
        <Button onClick={save} size="lg">
          {saved ? <><Check size={16} /> Changes Saved</> : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}
