import { type ChatSession, type User } from "@/types";

export const MOCK_USER: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: undefined,
};

export const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: "1",
    title: "React Component Help",
    timestamp: new Date(Date.now() - 3600000),
    preview: "Can you help me optimize this component?",
    messageCount: 5,
    messages: [],
  },
  {
    id: "2",
    title: "TypeScript Types Explanation",
    timestamp: new Date(Date.now() - 86400000),
    preview: "What's the difference between interface and type?",
    messageCount: 8,
    messages: [],
  },
  {
    id: "3",
    title: "Creative Writing Project",
    timestamp: new Date(Date.now() - 172800000),
    preview: "Help me write a short story about...",
    messageCount: 12,
    messages: [],
  },
];
