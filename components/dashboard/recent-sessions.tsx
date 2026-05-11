"use client";

import { useRouter } from "next/navigation";
import { Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionRow {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  timestamp: string;
  createdAt: string;
}

interface RecentSessionsProps {
  sessions: SessionRow[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No sessions yet
          </p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => router.push("/")}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">
                    {session.title}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {session.messageCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(session.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
