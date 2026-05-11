"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Empty, EmptyHeader } from "@/components/ui/empty";
import { BarChart3 } from "lucide-react";

interface SessionsChartProps {
  data: { date: string; count: number }[];
}

export function SessionsChart({ data }: SessionsChartProps) {
  const chartConfig: ChartConfig = {
    sessions: {
      label: "Sessions",
      color: "var(--chart-1)",
    },
  };

  const chartData = data.map((d) => ({
    date: d.date
      ? new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "",
    sessions: d.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions Over Time</CardTitle>
        <CardDescription>
          Your chat activity over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <BarChart3 className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No session data yet. Start a conversation to see your activity
                here.
              </p>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-[2/1] w-full">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, bottom: 5, left: -15 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
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
        )}
      </CardContent>
    </Card>
  );
}
