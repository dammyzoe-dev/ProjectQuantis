/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#05060A",
          panel: "#0A0D16",
          card: "#10131F",
          card2: "#14182A",
          border: "#1F2438",
          borderLight: "#2A3150",
        },
        signal: {
          indigo: "#5B5FEF",
          violet: "#8B5CF6",
          teal: "#22D3C7",
          tealDim: "#1A8F86",
        },
        loss: {
          DEFAULT: "#F0426B",
          dim: "#7A2438",
        },
        gain: {
          DEFAULT: "#22D3C7",
          dim: "#1A8F86",
        },
        ink: {
          DEFAULT: "#E8EAF2",
          muted: "#8389A6",
          faint: "#4D5370",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "signal-gradient": "linear-gradient(135deg, #5B5FEF 0%, #8B5CF6 100%)",
        "teal-gradient": "linear-gradient(135deg, #22D3C7 0%, #1A8F86 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(91,95,239,0.15), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(91,95,239,0.4)",
        "glow-teal": "0 0 40px -10px rgba(34,211,199,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -8px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulse_ring: {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.3)", opacity: "0" },
          "100%": { transform: "scale(1.3)", opacity: "0" },
        },
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        pulse_ring: "pulse_ring 2.2s cubic-bezier(0.4,0,0.6,1) infinite",
        ticker: "ticker 40s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
