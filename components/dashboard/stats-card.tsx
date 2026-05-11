"use client";

import { type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="size-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="mt-1 flex items-center gap-2">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <Badge
              variant={trend.positive ? "secondary" : "destructive"}
              className="text-xs"
            >
              {trend.positive ? "↑" : "↓"} {trend.value}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
