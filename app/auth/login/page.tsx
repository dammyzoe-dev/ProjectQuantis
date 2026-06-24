"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye, EyeOff, ArrowRight, ShieldCheck, Smartphone, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "credentials" | "2fa";

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  children,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-ink-muted">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={cn(
            "w-full rounded-xl border bg-void-card2 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:outline-none focus:ring-2 focus:ring-signal-indigo/40",
            error
              ? "border-loss/50 focus:border-loss"
              : "border-void-border focus:border-signal-indigo"
          )}
        />
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-loss">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; otp?: string }>({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateCredentials = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleCredentials = () => {
    const e = validateCredentials();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("2fa");
    }, 1200);
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  const handle2FA = () => {
    const code = otp.join("");
    if (code.length < 6) {
      setErrors({ otp: "Enter the 6-digit code from your authenticator app" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="rounded-2xl border border-void-border bg-void-panel/80 shadow-card backdrop-blur-xl">
        <div className="p-8">
          {step === "credentials" ? (
            <>
              <div className="mb-8">
                <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
                <p className="mt-1.5 text-sm text-ink-muted">
                  Sign in to your Quantis account
                </p>
              </div>

              {/* Social logins */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                {[
                  { label: "Google", icon: "G" },
                  { label: "Apple", icon: "" },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="flex items-center justify-center gap-2.5 rounded-xl border border-void-border bg-void-card2 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-void-borderLight"
                  >
                    <span className="text-base font-bold text-ink-muted">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-void-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-void-panel px-3 text-xs text-ink-faint">
                    or continue with email
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <InputField
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={setEmail}
                  error={errors.email}
                  autoComplete="email"
                />

                <InputField
                  label="Password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={setPassword}
                  error={errors.password}
                  autoComplete="current-password"
                >
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-3.5 text-ink-faint hover:text-ink-muted"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </InputField>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-2 text-ink-muted">
                    <div
                      onClick={() => setRememberMe(!rememberMe)}
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                        rememberMe
                          ? "border-signal-indigo bg-signal-indigo"
                          : "border-void-border bg-void-card2"
                      )}
                    >
                      {rememberMe && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    Remember me
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-signal-indigo hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  onClick={handleCredentials}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal-gradient py-3 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>Sign In <ArrowRight size={15} /></>
                  )}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-muted">
                <ShieldCheck size={12} className="text-gain" />
                256-bit encrypted · 2FA protected · SOC 2 compliant
              </div>
            </>
          ) : (
            <>
              {/* 2FA Step */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-signal-indigo/10 border border-signal-indigo/20">
                  <Smartphone size={24} className="text-signal-indigo" />
                </div>
                <h1 className="font-display text-2xl font-semibold text-ink">
                  Two-factor authentication
                </h1>
                <p className="mt-1.5 text-sm text-ink-muted">
                  Enter the 6-digit code from your authenticator app
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  Signing in as <span className="text-ink-muted">{email}</span>
                </p>
              </div>

              {/* OTP boxes */}
              <div className="mb-6 flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className={cn(
                      "h-12 w-10 rounded-xl border text-center font-mono text-xl font-semibold text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-signal-indigo/40",
                      digit
                        ? "border-signal-indigo bg-signal-indigo/10"
                        : "border-void-border bg-void-card2"
                    )}
                  />
                ))}
              </div>

              {errors.otp && (
                <p className="mb-4 flex items-center justify-center gap-1.5 text-xs text-loss">
                  <AlertCircle size={11} /> {errors.otp}
                </p>
              )}

              <button
                onClick={handle2FA}
                disabled={loading || otp.join("").length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal-gradient py-3 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>Verify &amp; Sign In <ArrowRight size={15} /></>
                )}
              </button>

              <div className="mt-4 flex flex-col items-center gap-2 text-xs text-ink-muted">
                <button className="hover:text-ink hover:underline">
                  Use a backup code instead
                </button>
                <button
                  onClick={() => setStep("credentials")}
                  className="hover:text-ink hover:underline"
                >
                  ← Back to sign in
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-medium text-signal-indigo hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
