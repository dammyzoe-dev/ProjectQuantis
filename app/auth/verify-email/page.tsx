"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    setError("");
    if (val && idx < 5) document.getElementById(`votp-${idx + 1}`)?.focus();
  };

  const handleKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`votp-${idx - 1}`)?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      document.getElementById("votp-5")?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits"); return; }
    setLoading(true);
    setTimeout(() => { window.location.href = "/kyc"; }, 1200);
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("votp-0")?.focus();
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-void-border bg-void-panel/80 shadow-card backdrop-blur-xl">
        <div className="p-8">
          <div className="mb-7 text-center">
            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
              <span className="absolute h-14 w-14 animate-pulse_ring rounded-full bg-signal-indigo/20" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-signal-indigo/20 bg-signal-indigo/10">
                <Mail size={24} className="text-signal-indigo" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink">Verify your email</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              We sent a 6-digit code to your email address. Enter it below to confirm your account.
            </p>
          </div>

          {/* OTP input */}
          <div className="mb-5 flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`votp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={cn(
                  "h-13 w-11 rounded-xl border text-center font-mono text-xl font-bold text-ink transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-signal-indigo/40",
                  digit
                    ? "border-signal-indigo bg-signal-indigo/10 shadow-glow"
                    : error
                    ? "border-loss/50 bg-void-card2"
                    : "border-void-border bg-void-card2"
                )}
                style={{ height: "52px", width: "44px" }}
              />
            ))}
          </div>

          {error && (
            <p className="mb-4 text-center text-xs text-loss">{error}</p>
          )}

          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal-gradient py-3 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>Verify Email <ArrowRight size={15} /></>
            )}
          </button>

          {/* Resend */}
          <div className="mt-5 text-center text-sm">
            {resendCountdown > 0 ? (
              <p className="text-ink-muted">
                Resend code in{" "}
                <span className="font-mono font-semibold text-ink">{resendCountdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="flex items-center justify-center gap-1.5 mx-auto text-signal-indigo hover:underline"
              >
                <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                {resending ? "Sending..." : "Resend code"}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Wrong email?{" "}
        <Link href="/auth/register" className="font-medium text-signal-indigo hover:underline">
          Go back
        </Link>
      </p>
    </div>
  );
}
