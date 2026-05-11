import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { sessions, messages, settings } from "@/db/schema";
import { DEFAULT_SETTINGS } from "@/types";
import { storageRateLimiter } from "@/lib/rate-limiter";

interface MessageInput {
  id: string;
  role: string;
  content: string;
  contentType?: string | null;
  timestamp: string;
}

interface SaveMessagesBody {
  action: "saveMessages";
  sessionId: string;
  messages: MessageInput[];
}

interface SaveSessionBody {
  action: "saveSession";
  session: {
    id: string;
    title: string;
    preview: string;
    messageCount: number;
    timestamp: string;
  };
}

interface SaveSettingsBody {
  action: "saveSettings";
  appSettings: Record<string, unknown>;
}

type RequestBody =
  | { action: "getMessages"; sessionId: string }
  | SaveMessagesBody
  | { action: "getSessions" }
  | SaveSessionBody
  | { action: "deleteSession"; sessionId: string }
  | { action: "getSettings" }
  | SaveSettingsBody
  | { action: "getDashboardStats" };

type Handler = (body: RequestBody, userId: string) => Promise<NextResponse>;

const handlers: Record<string, Handler> = {
  getMessages: async (body) => {
    const b = body as { action: "getMessages"; sessionId: string };
    const rows = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, b.sessionId))
      .orderBy(messages.createdAt);
    return NextResponse.json(rows);
  },

  saveMessages: async (body, userId) => {
    const b = body as SaveMessagesBody;
    if (b.messages.length > 0) {
      await db.insert(messages).values(
        b.messages.map((msg) => ({
          id: msg.id,
          sessionId: b.sessionId,
          userId,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          contentType: msg.contentType || null,
          timestamp: msg.timestamp,
          createdAt: msg.timestamp,
        })),
      ).onConflictDoNothing({ target: messages.id });
    }
    return NextResponse.json({ ok: true });
  },

  getSessions: async (body, userId) => {
    const rows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(sql`${sessions.timestamp} DESC`);
    return NextResponse.json(rows);
  },

  saveSession: async (body, userId) => {
    const b = body as SaveSessionBody;
    const s = b.session;
    await db
      .insert(sessions)
      .values({
        id: s.id,
        userId,
        title: s.title,
        preview: s.preview,
        messageCount: s.messageCount,
        timestamp: s.timestamp,
        createdAt: s.timestamp,
      })
      .onConflictDoUpdate({
        target: sessions.id,
        set: {
          title: s.title,
          preview: s.preview,
          messageCount: s.messageCount,
          timestamp: s.timestamp,
        },
      });
    return NextResponse.json({ ok: true });
  },

  deleteSession: async (body) => {
    const b = body as { action: "deleteSession"; sessionId: string };
    const existing = await db.select({ id: sessions.id }).from(sessions)
      .where(eq(sessions.id, b.sessionId));
    if (!existing.length) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    await db.delete(messages).where(eq(messages.sessionId, b.sessionId));
    await db.delete(sessions).where(eq(sessions.id, b.sessionId));
    return NextResponse.json({ ok: true });
  },

  getSettings: async () => {
    const [row] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, "default"));
    return NextResponse.json(row?.data || DEFAULT_SETTINGS);
  },

  saveSettings: async (body) => {
    const b = body as SaveSettingsBody;
    await db
      .insert(settings)
      .values({
        id: "default",
        userId: "default",
        data: JSON.stringify(b.appSettings),
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: settings.id,
        set: {
          data: JSON.stringify(b.appSettings),
          updatedAt: new Date().toISOString(),
        },
      });
    return NextResponse.json({ ok: true });
  },

  getDashboardStats: async (body, userId) => {
    const [sessionCount] = await db
      .select({ value: sql<number>`count(*)` })
      .from(sessions)
      .where(eq(sessions.userId, userId));

    const [messageCount] = await db
      .select({ value: sql<number>`count(*)` })
      .from(messages)
      .where(eq(messages.userId, userId));

    const [activeDays] = await db
      .select({ value: sql<number>`count(distinct ${sessions.timestamp}::date)` })
      .from(sessions)
      .where(eq(sessions.userId, userId));

    const sessionsByDay = await db
      .select({
        date: sql<string>`${sessions.timestamp}::date`,
        count: sql<number>`count(*)`,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .groupBy(sql`${sessions.timestamp}::date`)
      .orderBy(sql`${sessions.timestamp}::date desc`)
      .limit(30);

    const contentTypeDist = await db
      .select({
        contentType: messages.contentType,
        count: sql<number>`count(*)`,
      })
      .from(messages)
      .where(sql`${messages.userId} = ${userId} and ${messages.role} = 'user'`)
      .groupBy(messages.contentType);

    const recentSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(sql`${sessions.timestamp} desc`)
      .limit(10);

    const total = Number(sessionCount?.value || 0);
    const totalMsgs = Number(messageCount?.value || 0);

    return NextResponse.json({
      totalSessions: total,
      totalMessages: totalMsgs,
      activeDays: Number(activeDays?.value || 0),
      averageMessagesPerSession: total > 0 ? Math.round(totalMsgs / total) : 0,
      sessionsByDay,
      contentTypeDistribution: contentTypeDist,
      recentSessions,
    });
  },
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = storageRateLimiter.check(`storage:${session.user.id}:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests", resetAt: rl.resetAt },
        { status: 429 },
      );
    }

    const body: RequestBody = await request.json();

    const handler = handlers[body.action];
    if (!handler) {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return handler(body, session.user.id);
  } catch (error) {
    console.error("Storage API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
