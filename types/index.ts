export type AssetClass = "crypto" | "forex";

export type SignalAction = "BUY" | "SELL" | "HOLD";

export type TradingMode =
  | "suggestions"
  | "semi-auto"
  | "full-auto"
  | "paper";

export interface MarketAsset {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  changePercent24h: number;
  changeAbs24h: number;
  volume24h: number;
  sparkline: number[];
  icon: string;
}

export interface AISignal {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  action: SignalAction;
  confidence: number; // 0-100
  generatedAt: string;
  timeframe: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskLevel: "Low" | "Medium" | "High";
  recommendedPositionPct: number;
  reasoning: {
    technical: string;
    sentiment: string;
    model: string;
  };
  modelBreakdown: {
    label: string;
    weight: number;
    lean: SignalAction;
  }[];
}

export interface PortfolioHolding {
  symbol: string;
  assetClass: AssetClass;
  amount: number;
  avgEntry: number;
  currentPrice: number;
  valueUsd: number;
  pnlUsd: number;
  pnlPercent: number;
  locked: boolean;
}

export interface ConnectedAccount {
  id: string;
  provider: string;
  type: "exchange" | "broker";
  status: "connected" | "disconnected" | "error";
  permission: "read-only" | "trade";
  lastSync: string;
  logoColor: string;
}

export interface WalletAssetBalance {
  symbol: string;
  assetClass: AssetClass | "fiat";
  available: number;
  locked: number;
  usdValue: number;
}

export type TxType = "deposit" | "withdrawal";
export type TxStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  type: TxType;
  asset: string;
  amount: number;
  usdValue: number;
  method: string;
  status: TxStatus;
  date: string;
  fee: number;
  destination?: string;
}

export interface SentimentPoint {
  label: string;
  score: number; // -100 to 100
}
