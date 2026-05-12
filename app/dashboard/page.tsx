"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  MessageSquare,
  MessagesSquare,
  CalendarDays,
  BarChart3,
  Sparkles,
  ArrowLeft,
  Activity,
  TrendingUp,
} from "lucide-react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SessionsChart } from "@/components/dashboard/sessions-chart";
import { ContentTypeChart } from "@/components/dashboard/content-type-chart";
import { RecentSessions } from "@/components/dashboard/recent-sessions";

interface DashboardStats {
  totalSessions: number;
  totalMessages: number;
  activeDays: number;
  averageMessagesPerSession: number;
  sessionsByDay: { date: string; count: number }[];
  contentTypeDistribution: { contentType: string | null; count: number }[];
  recentSessions: {
    id: string;
    title: string;
    preview: string;
    messageCount: number;
    timestamp: string;
    createdAt: string;
  }[];
}

function LoadingSkeleton() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <DottedGlowBackground
        className="pointer-events-none -z-10"
        opacity={0.4}
        gap={16}
        radius={1.5}
        colorLightVar="--color-neutral-400"
        glowColorLightVar="--color-primary"
        colorDarkVar="--color-neutral-700"
        glowColorDarkVar="--color-primary"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.5}
        speedScale={1}
      />
      <header className="flex h-16 w-full items-center border-b bg-background/80 px-6 backdrop-blur-lg">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="ml-auto h-5 w-24" />
      </header>
      <main className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, isPending: authPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authPending) return;
    if (!session) {
      router.push("/sign-in");
      return;
    }

    fetch("/api/storage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getDashboardStats" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session, authPending, router]);

  if (authPending || loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="relative flex h-screen flex-col items-center justify-center gap-4 overflow-hidden">
        <DottedGlowBackground
          className="pointer-events-none -z-10"
          opacity={0.4}
          gap={16}
          radius={1.5}
          colorLightVar="--color-neutral-400"
          glowColorLightVar="--color-primary"
          colorDarkVar="--color-neutral-700"
          glowColorDarkVar="--color-primary"
          backgroundOpacity={0}
          speedMin={0.3}
          speedMax={1.5}
          speedScale={1}
        />
        <p className="text-destructive">{error}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="size-4" />
          Back to Chat
        </Link>
      </div>
    );
  }

  const user = session?.user;
  const totalSessions = stats?.totalSessions ?? 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <DottedGlowBackground
        className="pointer-events-none -z-10"
        opacity={0.4}
        gap={16}
        radius={1.5}
        colorLightVar="--color-neutral-400"
        glowColorLightVar="--color-primary"
        colorDarkVar="--color-neutral-700"
        glowColorDarkVar="--color-primary"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.5}
        speedScale={1}
      />
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-3">
            <Image src="/logo_dark.png" alt="Shibu AI" width={105} height={117} className="h-9 w-auto block dark:hidden" priority />
            <span className="text-xl font-bold tracking-tight">
              Dashboard
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {user?.email}
          </Badge>
          <span className="text-sm text-muted-foreground sm:hidden">
            {user?.name || user?.email}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s an overview of your activity
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <MessageSquare className="size-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Sessions"
            value={totalSessions}
            icon={MessageSquare}
            description={`${stats?.recentSessions?.length ?? 0} in last 30 days`}
          />
          <StatsCard
            title="Total Messages"
            value={stats?.totalMessages ?? 0}
            icon={MessagesSquare}
          />
          <StatsCard
            title="Active Days"
            value={stats?.activeDays ?? 0}
            icon={CalendarDays}
          />
          <StatsCard
            title="Avg Messages/Session"
            value={stats?.averageMessagesPerSession ?? 0}
            icon={BarChart3}
            trend={
              totalSessions > 0
                ? {
                    value: Math.min(
                      Math.round(
                        ((stats?.averageMessagesPerSession ?? 0) / 10) * 100,
                      ),
                      99,
                    ),
                    positive: (stats?.averageMessagesPerSession ?? 0) > 5,
                  }
                : undefined
            }
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <Activity className="size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity">
              <TrendingUp className="size-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <SessionsChart data={stats?.sessionsByDay ?? []} />
              <ContentTypeChart data={stats?.contentTypeDistribution ?? []} />
            </div>
            <RecentSessions sessions={stats?.recentSessions ?? []} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <SessionsChart data={stats?.sessionsByDay ?? []} />
            <RecentSessions sessions={stats?.recentSessions ?? []} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
