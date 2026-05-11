"use client";

import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Empty, EmptyHeader } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";

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
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>
          Your latest conversations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <MessageSquare className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No sessions yet. Start a conversation!
              </p>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Messages</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.slice(0, 10).map((session) => (
                <TableRow
                  key={session.id}
                  className="cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  <TableCell className="font-medium truncate max-w-[200px]">
                    {session.title}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary">{session.messageCount}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {new Date(session.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
