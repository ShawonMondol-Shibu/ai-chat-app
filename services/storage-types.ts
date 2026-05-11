import { type Message, type ChatSession, type AppSettings } from "@/types";

export interface ChatStorageService {
  getMessages(sessionId: string): Promise<Message[]>;
  saveMessages(sessionId: string, messages: Message[]): Promise<void>;
  getSessions(): Promise<ChatSession[]>;
  saveSession(session: ChatSession): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
}

export interface SettingsStorageService {
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
}

export interface StorageService extends ChatStorageService, SettingsStorageService {}
