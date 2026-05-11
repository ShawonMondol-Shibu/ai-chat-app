"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionsChartProps {
  data: { date: string; count: number }[];
}

export function SessionsChart({ data }: SessionsChartProps) {
  const chartConfig = {
    sessions: {
      label: "Sessions",
      color: "var(--chart-1)",
    },
  };

  const chartData = data.map((d) => ({
    date: d.date ? new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) : "",
    sessions: d.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sessions Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="sessions"
              fill="var(--color-sessions)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        {chartData.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No session data yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
