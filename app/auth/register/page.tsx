"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special character", pass: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-loss", "bg-loss", "bg-amber-400", "bg-amber-400", "bg-gain"];
  const labels = ["", "Weak", "Weak", "Fair", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score] : "bg-void-border"
            )}
          />
        ))}
        <span className={cn("ml-2 text-xs font-medium", score <= 2 ? "text-loss" : score === 3 ? "text-amber-400" : "text-gain")}>
          {labels[score]}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <div key={c.label} className={cn("flex items-center gap-1.5 text-xs", c.pass ? "text-gain" : "text-ink-faint")}>
            <Check size={10} className={c.pass ? "opacity-100" : "opacity-30"} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be at least 8 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    if (!agree) e.agree = "You must accept the terms to continue";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/auth/verify-email";
    }, 1400);
  };

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts?: {
      type?: string;
      placeholder?: string;
      autoComplete?: string;
      error?: string;
      suffix?: React.ReactNode;
    }
  ) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-ink-muted">{label}</label>
      <div className="relative">
        <input
          type={opts?.type ?? "text"}
          placeholder={opts?.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={opts?.autoComplete}
          className={cn(
            "w-full rounded-xl border bg-void-card2 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:outline-none focus:ring-2 focus:ring-signal-indigo/40",
            opts?.error ? "border-loss/50" : "border-void-border focus:border-signal-indigo"
          )}
        />
        {opts?.suffix}
      </div>
      {opts?.error && (
        <p className="flex items-center gap-1.5 text-xs text-loss">
          <AlertCircle size={11} /> {opts.error}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-void-border bg-void-panel/80 shadow-card backdrop-blur-xl">
        <div className="p-8">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Start trading smarter with AI-powered signals
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {field("First name", firstName, setFirstName, {
                placeholder: "Alex",
                autoComplete: "given-name",
                error: errors.firstName,
              })}
              {field("Last name", lastName, setLastName, {
                placeholder: "Trader",
                autoComplete: "family-name",
                error: errors.lastName,
              })}
            </div>

            {field("Email address", email, setEmail, {
              type: "email",
              placeholder: "you@example.com",
              autoComplete: "email",
              error: errors.email,
            })}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-muted">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={cn(
                    "w-full rounded-xl border bg-void-card2 px-4 py-3 pr-10 text-sm text-ink placeholder:text-ink-faint transition-colors focus:outline-none focus:ring-2 focus:ring-signal-indigo/40",
                    errors.password ? "border-loss/50" : "border-void-border focus:border-signal-indigo"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-3.5 text-ink-faint hover:text-ink-muted"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1.5 text-xs text-loss">
                  <AlertCircle size={11} /> {errors.password}
                </p>
              )}
              <PasswordStrength password={password} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-muted">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  className={cn(
                    "w-full rounded-xl border bg-void-card2 px-4 py-3 pr-10 text-sm text-ink placeholder:text-ink-faint transition-colors focus:outline-none focus:ring-2 focus:ring-signal-indigo/40",
                    errors.confirm ? "border-loss/50" : confirm && confirm === password ? "border-gain/50" : "border-void-border focus:border-signal-indigo"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-3.5 text-ink-faint hover:text-ink-muted"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirm && confirm === password && (
                  <Check size={16} className="absolute right-3.5 top-3.5 text-gain" />
                )}
              </div>
              {errors.confirm && (
                <p className="flex items-center gap-1.5 text-xs text-loss">
                  <AlertCircle size={11} /> {errors.confirm}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-1">
              <label className="flex cursor-pointer items-start gap-3">
                <div
                  onClick={() => setAgree(!agree)}
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                    agree ? "border-signal-indigo bg-signal-indigo" : "border-void-border bg-void-card2"
                  )}
                >
                  {agree && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs leading-relaxed text-ink-muted">
                  I agree to the{" "}
                  <a href="#" className="text-signal-indigo hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-signal-indigo hover:underline">Privacy Policy</a>.
                  I understand that trading involves significant risk of loss.
                </span>
              </label>
              {errors.agree && (
                <p className="flex items-center gap-1.5 text-xs text-loss pl-7">
                  <AlertCircle size={11} /> {errors.agree}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal-gradient py-3 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-muted">
            <ShieldCheck size={12} className="text-gain" />
            Your data is encrypted and never shared with third parties
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-signal-indigo hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
