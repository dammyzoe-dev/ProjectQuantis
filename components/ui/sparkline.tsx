"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

export function Sparkline({
  data,
  positive,
  height = 40,
}: {
  data: number[];
  positive: boolean;
  height?: number;
}) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = positive ? "#22D3C7" : "#F0426B";

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          {/* Recharts v3: use width={0} instead of hide prop */}
          <YAxis width={0} tick={false} axisLine={false} tickLine={false} domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
