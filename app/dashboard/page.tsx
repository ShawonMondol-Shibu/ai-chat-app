"use client";

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
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SessionsChart } from "@/components/dashboard/sessions-chart";
import { ContentTypeChart } from "@/components/dashboard/content-type-chart";
import { RecentSessions } from "@/components/dashboard/recent-sessions";
import { Button } from "@/components/ui/button";

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
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => router.push("/")}>Back to Chat</Button>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] bg-clip-text text-transparent">
              Dashboard
            </span>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          {user?.name || user?.email}
        </span>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your activity
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Sessions"
            value={stats?.totalSessions ?? 0}
            icon={MessageSquare}
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
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SessionsChart data={stats?.sessionsByDay ?? []} />
          <ContentTypeChart data={stats?.contentTypeDistribution ?? []} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentSessions sessions={stats?.recentSessions ?? []} />
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-start gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <MessageSquare className="h-4 w-4" />
                Start New Chat
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
