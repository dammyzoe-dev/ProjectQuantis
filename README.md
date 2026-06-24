# Quantis — AI-Powered Hybrid Trading Platform

A modern, premium fintech UI for crypto and forex trading with AI-generated signals, portfolio management, wallet operations, exchange/broker API management, and risk controls.

> **This is a frontend scaffold with demo data.** No real money, no live exchange connections, no actual trades are made. All market data, signals, balances and transactions are simulated.

---

## Pages

| Page | Route | What's inside |
|------|-------|--------------|
| **Sign In** | `/auth/login` | Email/password login, Google/Apple SSO buttons, inline 2FA OTP step with paste support |
| **Register** | `/auth/register` | Full registration form, live password strength meter, terms acceptance |
| **Forgot Password** | `/auth/forgot-password` | Email input, sent-confirmation state |
| **Verify Email** | `/auth/verify-email` | 6-digit OTP boxes, 60s resend countdown, paste support |
| **KYC Verification** | `/kyc` | 5-step flow: Personal Info → Identity Documents → Address → Financial Profile → Review & Submit |
| **Dashboard** | `/dashboard` | Portfolio value chart, holdings table, P&L stats, AI signal preview, risk gauges, sentiment |
| **AI Assistant** | `/assistant` | Signal cards with confidence ribbon, model breakdown, full reasoning, position calculator |
| **Markets** | `/markets` | Unified crypto + forex watchlist, detail chart, per-asset AI signal |
| **Trading** | `/trading` | Live price chart, quick trade panel (market/limit/stop), order table, semi-auto approval queue |
| **Wallet** | `/wallet` | Balance overview, deposit modal (crypto/bank/card), 3-step withdraw, transaction history |
| **API Management** | `/api-management` | Connect exchanges + brokers, encrypted key display, audit log |
| **Settings** | `/settings` | Trading mode, risk sliders, 2FA, notification preferences, profile |

### Design System
- **Palette:** Void black `#05060A` · Electric Indigo `#5B5FEF` · Signal Violet `#8B5CF6` · Teal `#22D3C7` · Loss Red `#F0426B`
- **Typography:** Space Grotesk (display) + Inter (body) + JetBrains Mono (prices/data)
- **Signature element:** Animated gradient confidence ribbon on every AI signal card

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install dependencies
```bash
cd quantis
npm install
```

### 2. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/auth/login`.

### 3. Build for production
```bash
npm run build
npm start
```

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
vercel
```
Follow the prompts. Vercel auto-detects Next.js.

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repository — framework auto-detected as **Next.js**
4. No environment variables needed for the demo
5. Click **Deploy**

---

## Project Structure

```
quantis/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, dark mode)
│   ├── page.tsx                      # Redirect → /auth/login
│   ├── globals.css                   # Global styles + animations
│   │
│   ├── auth/
│   │   ├── layout.tsx                # Auth shell (no sidebar, ambient bg)
│   │   ├── login/page.tsx            # Sign in + 2FA step
│   │   ├── register/page.tsx         # Sign up + password strength
│   │   ├── forgot-password/page.tsx  # Password reset request
│   │   └── verify-email/page.tsx     # Email OTP verification
│   │
│   ├── kyc/
│   │   ├── layout.tsx                # KYC shell
│   │   └── page.tsx                  # 5-step KYC wizard + success screen
│   │
│   ├── dashboard/
│   ├── assistant/
│   ├── markets/
│   ├── trading/
│   ├── wallet/
│   ├── api-management/
│   └── settings/
│
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx             # Sidebar + topbar wrapper
│   │   ├── sidebar.tsx               # Nav, KYC badge, user card, sign-out
│   │   └── topbar.tsx                # Live ticker, notifications
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── confidence-ribbon.tsx     # Animated AI confidence bar
│       └── sparkline.tsx
│
├── lib/
│   ├── mock-data.ts                  # Assets, AI signals, sentiment
│   ├── mock-portfolio.ts             # Portfolio, accounts, wallet, txns
│   └── utils.ts                      # Formatters, cn(), timeAgo()
│
├── types/index.ts
├── tailwind.config.js                # Full Quantis design token system
├── vercel.json
└── package.json
```

---

## Auth & KYC Flow

```
/ (root)
  └─→ /auth/login
        ├─→ /auth/register → /auth/verify-email → /kyc → /dashboard
        └─→ (login success) → /dashboard
```

### KYC Steps
1. **Personal Info** — Name, DOB (age 18+ validated), nationality, phone, gender
2. **Identity Documents** — Passport / ID / driving licence, doc number, expiry, front photo upload, selfie upload
3. **Address Verification** — Full address, country, proof of address upload
4. **Financial Profile** — Employment, income bracket, source of funds, experience, investment goal, PEP declaration, risk acknowledgement
5. **Review & Submit** — Summary of all sections with edit links, submission → success screen with application reference ID

---

## Extending with Real Data

### Authentication
Add [NextAuth.js](https://next-auth.js.org/) or [Clerk](https://clerk.com/) for real sessions. Protect routes with middleware in `middleware.ts`.

### KYC Provider
Integrate [Sumsub](https://sumsub.com/), [Onfido](https://onfido.com/), or [Jumio](https://www.jumio.com/) for real document verification.

### Live prices
Replace mock assets in `lib/mock-data.ts` with real API calls:
- Crypto: [CoinGecko API](https://www.coingecko.com/en/api)
- Forex: [Alpha Vantage](https://www.alphavantage.co/) or [OANDA v20 API](https://developer.oanda.com/)

### Real-time WebSockets
Add a `useWebSocket` hook subscribing to Binance WebSocket streams. Use `zustand` (already in `package.json`) for global state.

### Backend
Add API routes in `app/api/` (Next.js route handlers). Connect [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) + [Upstash Redis](https://upstash.com/) for persistence.

### AI Signals
Connect a Python FastAPI backend running LSTM / XGBoost / Transformer inference, exposing `/api/signals` consumed by the frontend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Icons | Lucide React |
| Animation | Framer Motion (installed) |
| State | Zustand (installed) |
| Types | TypeScript |
| Deployment | Vercel |
