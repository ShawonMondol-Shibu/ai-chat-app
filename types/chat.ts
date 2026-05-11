export enum ContentType {
  CREATIVE = "creative",
  CODE = "code",
  TECHNICAL = "technical",
  GENERAL = "general",
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  contentType?: ContentType;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
  messageCount: number;
  messages: Message[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
