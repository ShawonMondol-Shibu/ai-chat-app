import {
  type Message,
  type ChatSession,
  type AppSettings,
  ContentType,
} from "@/types";
import { type StorageService } from "@/services";

interface MessageRow {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  contentType: string | null;
  timestamp: string;
  createdAt: string;
}

interface SessionRow {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  timestamp: string;
  createdAt: string;
}

async function api<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/storage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Storage API error");
  return res.json();
}

export class ApiStorageService implements StorageService {
  async getMessages(sessionId: string): Promise<Message[]> {
    const rows: MessageRow[] = await api({ action: "getMessages", sessionId });
    return rows.map((row) => ({
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
      timestamp: new Date(row.timestamp),
      contentType: (row.contentType as ContentType) || undefined,
    }));
  }

  async saveMessages(sessionId: string, msgs: Message[]): Promise<void> {
    await api({
      action: "saveMessages",
      sessionId,
      messages: msgs.map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
      })),
    });
  }

  async getSessions(): Promise<ChatSession[]> {
    const rows: SessionRow[] = await api({ action: "getSessions" });
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      preview: row.preview,
      messageCount: row.messageCount,
      timestamp: new Date(row.timestamp),
      messages: [],
    }));
  }

  async saveSession(session: ChatSession): Promise<void> {
    await api({
      action: "saveSession",
      session: {
        ...session,
        timestamp: session.timestamp.toISOString(),
      },
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    await api({ action: "deleteSession", sessionId });
  }

  async getSettings(): Promise<AppSettings> {
    const data = await api<string | AppSettings>({ action: "getSettings" });
    if (typeof data === "string") return JSON.parse(data);
    return data as AppSettings;
  }

  async saveSettings(appSettings: AppSettings): Promise<void> {
    await api({ action: "saveSettings", appSettings });
  }
}
