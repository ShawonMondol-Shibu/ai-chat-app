"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Message, type ChatSession, type ContentType } from "@/types";
import { generateId } from "@/lib";
import { type AIService, type StorageService } from "@/services";

interface ChatContextValue {
  messages: Message[];
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, contentType: ContentType) => Promise<void>;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  aiService: AIService;
  storageService: StorageService;
}

export function ChatProvider({
  children,
  aiService,
  storageService,
}: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storageService.getSessions().then(setSessions);
  }, [storageService]);

  const loadSessionMessages = useCallback(
    async (sessionId: string) => {
      const stored = await storageService.getMessages(sessionId);
      setMessages(stored);
    },
    [storageService],
  );

  const selectSession = useCallback(
    (sessionId: string) => {
      setActiveSessionId(sessionId);
      loadSessionMessages(sessionId);
    },
    [loadSessionMessages],
  );

  const createNewSession = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
  }, []);

  const deleteSession = useCallback(
    async (sessionId: string) => {
      await storageService.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        createNewSession();
      }
    },
    [activeSessionId, createNewSession, storageService],
  );

  const sendMessage = useCallback(
    async (content: string, contentType: ContentType) => {
      if (!content.trim()) return;
      setError(null);
      setIsLoading(true);

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
        contentType,
      };

      setMessages((prev) => [...prev, userMessage]);

      if (activeSessionId) {
        await storageService.saveMessages(activeSessionId, [
          ...messages,
          userMessage,
        ]);
      }

      try {
        const response = await aiService.generateResponse(content, contentType);

        const aiMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
          contentType,
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (activeSessionId) {
          await storageService.saveMessages(activeSessionId, [
            ...messages,
            userMessage,
            aiMessage,
          ]);
        } else {
          const newSession: ChatSession = {
            id: generateId(),
            title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
            timestamp: new Date(),
            preview: content.slice(0, 80),
            messageCount: 2,
            messages: [userMessage, aiMessage],
          };
          setActiveSessionId(newSession.id);
          setSessions((prev) => [newSession, ...prev]);
          await storageService.saveSession(newSession);
          await storageService.saveMessages(newSession.id, [
            userMessage,
            aiMessage,
          ]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get response");
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId, aiService, messages, storageService],
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessions,
        activeSessionId,
        isLoading,
        error,
        sendMessage,
        createNewSession,
        selectSession,
        deleteSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}
