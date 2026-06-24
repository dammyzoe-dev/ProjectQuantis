import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantis — Identity Verification (KYC)",
};

export default function KycLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-void">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-60 top-0 h-[700px] w-[700px] rounded-full bg-signal-indigo/8 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-signal-violet/6 blur-[100px]" />
      </div>
      <header className="relative z-10 flex items-center justify-between border-b border-void-border bg-void-panel/60 px-8 py-4 backdrop-blur">
        <a href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal-gradient font-display text-xs font-bold text-white">
            Q
          </div>
          <span className="font-display text-base font-semibold text-ink">Quantis</span>
        </a>
        <span className="text-xs text-ink-muted">Identity Verification · Secured by Quantis Trust</span>
      </header>
      <main className="relative z-10">{children}</main>
    </div>
  );
}
