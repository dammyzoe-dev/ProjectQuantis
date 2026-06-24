import { AISignal, MarketAsset, SentimentPoint } from "@/types";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildSparkline(seed: number, base: number, volatility: number): number[] {
  const rand = seededRandom(seed);
  const points: number[] = [];
  let val = base;
  for (let i = 0; i < 24; i++) {
    val += (rand() - 0.5) * volatility;
    points.push(Math.max(val, base * 0.7));
  }
  return points;
}

export const CRYPTO_ASSETS: MarketAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    assetClass: "crypto",
    price: 71284.5,
    changePercent24h: 2.34,
    changeAbs24h: 1632.1,
    volume24h: 28_400_000_000,
    sparkline: buildSparkline(1, 70000, 1400),
    icon: "₿",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    assetClass: "crypto",
    price: 3845.22,
    changePercent24h: 1.12,
    changeAbs24h: 42.6,
    volume24h: 14_200_000_000,
    sparkline: buildSparkline(2, 3800, 90),
    icon: "Ξ",
  },
  {
    symbol: "SOL",
    name: "Solana",
    assetClass: "crypto",
    price: 178.93,
    changePercent24h: -3.21,
    changeAbs24h: -5.94,
    volume24h: 3_900_000_000,
    sparkline: buildSparkline(3, 182, 6),
    icon: "◎",
  },
  {
    symbol: "XRP",
    name: "Ripple",
    assetClass: "crypto",
    price: 0.612,
    changePercent24h: 0.85,
    changeAbs24h: 0.0052,
    volume24h: 1_800_000_000,
    sparkline: buildSparkline(4, 0.6, 0.02),
    icon: "✕",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    assetClass: "crypto",
    price: 0.448,
    changePercent24h: -1.05,
    changeAbs24h: -0.0047,
    volume24h: 612_000_000,
    sparkline: buildSparkline(5, 0.45, 0.015),
    icon: "₳",
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    assetClass: "crypto",
    price: 0.1842,
    changePercent24h: 4.62,
    changeAbs24h: 0.0081,
    volume24h: 980_000_000,
    sparkline: buildSparkline(6, 0.176, 0.008),
    icon: "Ð",
  },
];

export const FOREX_ASSETS: MarketAsset[] = [
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    assetClass: "forex",
    price: 1.0842,
    changePercent24h: 0.18,
    changeAbs24h: 0.0019,
    volume24h: 0,
    sparkline: buildSparkline(7, 1.082, 0.004),
    icon: "€",
  },
  {
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    assetClass: "forex",
    price: 1.2715,
    changePercent24h: -0.24,
    changeAbs24h: -0.003,
    volume24h: 0,
    sparkline: buildSparkline(8, 1.274, 0.005),
    icon: "£",
  },
  {
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    assetClass: "forex",
    price: 156.42,
    changePercent24h: 0.41,
    changeAbs24h: 0.64,
    volume24h: 0,
    sparkline: buildSparkline(9, 155.8, 0.6),
    icon: "¥",
  },
  {
    symbol: "XAU/USD",
    name: "Gold Spot / US Dollar",
    assetClass: "forex",
    price: 2342.8,
    changePercent24h: 0.62,
    changeAbs24h: 14.4,
    volume24h: 0,
    sparkline: buildSparkline(10, 2330, 18),
    icon: "Au",
  },
  {
    symbol: "USD/CHF",
    name: "US Dollar / Swiss Franc",
    assetClass: "forex",
    price: 0.9012,
    changePercent24h: -0.11,
    changeAbs24h: -0.001,
    volume24h: 0,
    sparkline: buildSparkline(11, 0.902, 0.003),
    icon: "₣",
  },
  {
    symbol: "AUD/USD",
    name: "Australian Dollar / US Dollar",
    assetClass: "forex",
    price: 0.6634,
    changePercent24h: 0.29,
    changeAbs24h: 0.0019,
    volume24h: 0,
    sparkline: buildSparkline(12, 0.661, 0.003),
    icon: "A$",
  },
];

export const ALL_ASSETS = [...CRYPTO_ASSETS, ...FOREX_ASSETS];

export const SENTIMENT_TREND: SentimentPoint[] = [
  { label: "Mon", score: 12 },
  { label: "Tue", score: 28 },
  { label: "Wed", score: 18 },
  { label: "Thu", score: 41 },
  { label: "Fri", score: 35 },
  { label: "Sat", score: 52 },
  { label: "Sun", score: 47 },
];

export const AI_SIGNALS: AISignal[] = [
  {
    id: "sig-btc-1",
    symbol: "BTC",
    assetClass: "crypto",
    action: "BUY",
    confidence: 84,
    generatedAt: new Date(Date.now() - 6 * 60000).toISOString(),
    timeframe: "4H",
    entryPrice: 71284.5,
    stopLoss: 69100,
    takeProfit: 75600,
    riskLevel: "Medium",
    recommendedPositionPct: 4.5,
    reasoning: {
      technical:
        "Price reclaimed the 50-period EMA on the 4H chart with rising volume. RSI is at 61, trending up without being overbought. MACD shows a fresh bullish crossover.",
      sentiment:
        "Social and news sentiment shifted positive over the last 12 hours, with on-chain exchange outflows suggesting accumulation by larger wallets.",
      model:
        "The LSTM price-prediction model and the gradient-boosted trend classifier both point to continued upside over the next 4-8 hours, agreeing with 79% historical accuracy on similar setups.",
    },
    modelBreakdown: [
      { label: "Technical (TA)", weight: 40, lean: "BUY" },
      { label: "Sentiment (NLP)", weight: 25, lean: "BUY" },
      { label: "ML Trend (LSTM)", weight: 35, lean: "BUY" },
    ],
  },
  {
    id: "sig-eth-1",
    symbol: "ETH",
    assetClass: "crypto",
    action: "HOLD",
    confidence: 58,
    generatedAt: new Date(Date.now() - 14 * 60000).toISOString(),
    timeframe: "1H",
    entryPrice: 3845.22,
    stopLoss: 3720,
    takeProfit: 4020,
    riskLevel: "Low",
    recommendedPositionPct: 0,
    reasoning: {
      technical:
        "Price is consolidating in a tight range between key support and resistance with no clear breakout direction. Volume has been declining for the past 6 hours.",
      sentiment:
        "Sentiment is mixed, with bullish ETF-flow narratives offset by broader macro caution ahead of upcoming economic data releases.",
      model:
        "Model ensemble confidence is below the action threshold; the system recommends waiting for a confirmed range breakout rather than entering a new position.",
    },
    modelBreakdown: [
      { label: "Technical (TA)", weight: 40, lean: "HOLD" },
      { label: "Sentiment (NLP)", weight: 25, lean: "BUY" },
      { label: "ML Trend (LSTM)", weight: 35, lean: "HOLD" },
    ],
  },
  {
    id: "sig-sol-1",
    symbol: "SOL",
    assetClass: "crypto",
    action: "SELL",
    confidence: 71,
    generatedAt: new Date(Date.now() - 22 * 60000).toISOString(),
    timeframe: "4H",
    entryPrice: 178.93,
    stopLoss: 188.5,
    takeProfit: 162,
    riskLevel: "High",
    recommendedPositionPct: 2.5,
    reasoning: {
      technical:
        "Price broke below a key ascending trendline with a bearish engulfing candle on high volume. RSI has crossed below 45, confirming downside momentum.",
      sentiment:
        "Negative sentiment spike following network congestion reports; social mention volume of negative keywords increased sharply in the last 3 hours.",
      model:
        "The XGBoost classifier flags a high-probability continuation of the downtrend over the next 6-10 hours based on similar historical volatility clusters.",
    },
    modelBreakdown: [
      { label: "Technical (TA)", weight: 40, lean: "SELL" },
      { label: "Sentiment (NLP)", weight: 25, lean: "SELL" },
      { label: "ML Trend (LSTM)", weight: 35, lean: "SELL" },
    ],
  },
  {
    id: "sig-xauusd-1",
    symbol: "XAU/USD",
    assetClass: "forex",
    action: "BUY",
    confidence: 77,
    generatedAt: new Date(Date.now() - 31 * 60000).toISOString(),
    timeframe: "1D",
    entryPrice: 2342.8,
    stopLoss: 2305,
    takeProfit: 2410,
    riskLevel: "Low",
    recommendedPositionPct: 3,
    reasoning: {
      technical:
        "Gold is holding above the 200-day moving average with a higher-low structure intact. Momentum oscillators show bullish divergence on the daily chart.",
      sentiment:
        "Safe-haven demand is elevated amid macro uncertainty, and recent central bank commentary has been interpreted as supportive of gold.",
      model:
        "The transformer-based macro model assigns a high probability to continued strength, citing correlation with real-yield trends.",
    },
    modelBreakdown: [
      { label: "Technical (TA)", weight: 35, lean: "BUY" },
      { label: "Sentiment (NLP)", weight: 30, lean: "BUY" },
      { label: "ML Trend (Transformer)", weight: 35, lean: "BUY" },
    ],
  },
  {
    id: "sig-eurusd-1",
    symbol: "EUR/USD",
    assetClass: "forex",
    action: "HOLD",
    confidence: 49,
    generatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    timeframe: "4H",
    entryPrice: 1.0842,
    stopLoss: 1.078,
    takeProfit: 1.092,
    riskLevel: "Medium",
    recommendedPositionPct: 0,
    reasoning: {
      technical:
        "Price is range-bound ahead of upcoming central bank statements, with no clear directional bias on lower timeframes.",
      sentiment:
        "Sentiment is neutral overall, with traders broadly positioned on the sidelines awaiting policy guidance.",
      model:
        "Model confidence is below threshold; the system suggests waiting for the macro catalyst to pass before committing to a position.",
    },
    modelBreakdown: [
      { label: "Technical (TA)", weight: 35, lean: "HOLD" },
      { label: "Sentiment (NLP)", weight: 30, lean: "HOLD" },
      { label: "ML Trend (Transformer)", weight: 35, lean: "BUY" },
    ],
  },
  {
    id: "sig-gbpusd-1",
    symbol: "GBP/USD",
    assetClass: "forex",
    action: "SELL",
    confidence: 66,
    generatedAt: new Date(Date.now() - 52 * 60000).toISOString(),
    timeframe: "1H",
    entryPrice: 1.2715,
    stopLoss: 1.2790,
    takeProfit: 1.2590,
    riskLevel: "Medium",
    recommendedPositionPct: 2,
    reasoning: {
      technical:
        "Price rejected a key resistance zone with a double-top pattern forming on the 1H chart, accompanied by declining momentum.",
      sentiment:
        "Recent UK economic data came in below expectations, weighing on sentiment toward the pound in the short term.",
      model:
        "Ensemble models lean bearish in the near term, though confidence is moderate given mixed signals from longer timeframes.",
    },
    modelBreakdown: [
      { label: "Technical (TA)", weight: 35, lean: "SELL" },
      { label: "Sentiment (NLP)", weight: 30, lean: "SELL" },
      { label: "ML Trend (Transformer)", weight: 35, lean: "HOLD" },
    ],
  },
];
