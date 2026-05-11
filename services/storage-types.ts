import { type Message, type ChatSession, type AppSettings } from "@/types";

export interface StorageService {
  getMessages(sessionId: string): Promise<Message[]>;
  saveMessages(sessionId: string, messages: Message[]): Promise<void>;
  getSessions(): Promise<ChatSession[]>;
  saveSession(session: ChatSession): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
}
