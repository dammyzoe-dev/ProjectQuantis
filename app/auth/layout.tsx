import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantis — Sign In",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-void">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial glow top-left */}
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-signal-indigo/10 blur-[120px]" />
        {/* Radial glow bottom-right */}
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-signal-violet/8 blur-[100px]" />
        {/* Subtle grid */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="auth-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      {/* Top bar with logo */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient font-display text-sm font-bold text-white shadow-glow">
            Q
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Quantis
          </span>
        </Link>
        <div className="flex items-center gap-1.5 rounded-full border border-gain/30 bg-gain/10 px-3 py-1 text-xs font-medium text-gain">
          <span className="h-1.5 w-1.5 rounded-full bg-gain" />
          Markets open
        </div>
      </header>

      {/* Page content */}
      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
