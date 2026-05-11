import {
  type Message,
  type ChatSession,
  type AppSettings,
  DEFAULT_SETTINGS,
} from "@/types";
import { type StorageService } from "@/services";

const MESSAGES_KEY = "chat_messages";
const SESSIONS_KEY = "chat_sessions";
const SETTINGS_KEY = "chat_settings";

export class MockStorageService implements StorageService {
  async getMessages(sessionId: string): Promise<Message[]> {
    const stored = localStorage.getItem(`${MESSAGES_KEY}_${sessionId}`);
    if (!stored) return [];
    return JSON.parse(stored).map((msg: Message) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  }

  async saveMessages(sessionId: string, messages: Message[]): Promise<void> {
    localStorage.setItem(`${MESSAGES_KEY}_${sessionId}`, JSON.stringify(messages));
  }

  async getSessions(): Promise<ChatSession[]> {
    const stored = localStorage.getItem(SESSIONS_KEY);
    if (!stored) return [];
    return JSON.parse(stored).map((session: ChatSession) => ({
      ...session,
      timestamp: new Date(session.timestamp),
    }));
  }

  async saveSession(session: ChatSession): Promise<void> {
    const sessions = await this.getSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }

  async deleteSession(sessionId: string): Promise<void> {
    const sessions = await this.getSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
    localStorage.removeItem(`${MESSAGES_KEY}_${sessionId}`);
  }

  async getSettings(): Promise<AppSettings> {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return JSON.parse(stored);
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
}
