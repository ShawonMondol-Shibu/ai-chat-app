"use client";

import { Pie, PieChart, Cell } from "recharts";
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
import { PieChart as PieChartIcon } from "lucide-react";

interface ContentTypeChartProps {
  data: { contentType: string | null; count: number }[];
}

const LABELS: Record<string, string> = {
  general: "General",
  code: "Code",
  technical: "Technical",
  creative: "Creative",
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ContentTypeChart({ data }: ContentTypeChartProps) {
  const chartData = data
    .filter((d) => d.contentType)
    .map((d, i) => ({
      name: LABELS[d.contentType!] || d.contentType!,
      value: d.count,
      fill: COLORS[i % COLORS.length],
    }));

  const chartConfig: ChartConfig = chartData.reduce(
    (acc, d, i) => ({
      ...acc,
      [d.name.toLowerCase()]: {
        label: d.name,
        color: COLORS[i % COLORS.length],
      },
    }),
    {} as ChartConfig,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages by Type</CardTitle>
        <CardDescription>
          Distribution of your conversations by content type
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <PieChartIcon className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No message data yet
              </p>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <ChartContainer
              config={chartConfig}
              className="aspect-square w-48 shrink-0"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
              </PieChart>
            </ChartContainer>

            <div className="flex flex-col gap-3">
              {chartData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3 text-sm">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-medium tabular-nums">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
