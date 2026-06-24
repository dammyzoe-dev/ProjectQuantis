"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Mail, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-void-border bg-void-panel/80 shadow-card backdrop-blur-xl">
        <div className="p-8">
          {!sent ? (
            <>
              <div className="mb-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-signal-indigo/20 bg-signal-indigo/10">
                  <Mail size={22} className="text-signal-indigo" />
                </div>
                <h1 className="font-display text-2xl font-semibold text-ink">Reset your password</h1>
                <p className="mt-1.5 text-sm text-ink-muted">
                  Enter your account email and we&apos;ll send you a secure reset link.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink-muted">Email address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    autoComplete="email"
                    className={cn(
                      "w-full rounded-xl border bg-void-card2 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-signal-indigo/40",
                      error ? "border-loss/50" : "border-void-border focus:border-signal-indigo"
                    )}
                  />
                  {error && (
                    <p className="flex items-center gap-1.5 text-xs text-loss">
                      <AlertCircle size={11} /> {error}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal-gradient py-3 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>Send Reset Link <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gain/10 border border-gain/20">
                <Mail size={28} className="text-gain" />
              </div>
              <h1 className="font-display text-xl font-semibold text-ink">Check your inbox</h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-ink">{email}</span>.
                The link expires in 15 minutes.
              </p>
              <div className="mt-5 w-full rounded-xl border border-void-border bg-void-card2 px-4 py-3 text-left text-xs text-ink-muted">
                Didn&apos;t receive it? Check your spam folder, or{" "}
                <button onClick={() => setSent(false)} className="text-signal-indigo hover:underline">
                  try a different email
                </button>.
              </div>
            </div>
          )}
        </div>
      </div>

      <Link
        href="/auth/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft size={14} /> Back to sign in
      </Link>
    </div>
  );
}
