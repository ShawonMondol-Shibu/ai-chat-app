"use client";

import { useState } from "react";
import { type Message, type ChatSession, type ContentType } from "@/types";
import { generateId } from "@/lib";
import { type AIService, type ChatStorageService } from "@/services";

interface UseSendMessageOptions {
  aiService: AIService;
  storageService: ChatStorageService;
}

interface UseSendMessageReturn {
  isLoading: boolean;
  error: string | null;
  sendMessage: (
    content: string,
    contentType: ContentType,
    activeSessionId: string | null,
    onMessage: (message: Message) => void,
    onSessionCreated: (session: ChatSession) => void,
    onSessionSelected: (sessionId: string) => void,
  ) => Promise<void>;
}

export function useSendMessage({
  aiService,
  storageService,
}: UseSendMessageOptions): UseSendMessageReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    content: string,
    contentType: ContentType,
    activeSessionId: string | null,
    onMessage: (message: Message) => void,
    onSessionCreated: (session: ChatSession) => void,
    onSessionSelected: (sessionId: string) => void,
  ) => {
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

    onMessage(userMessage);

    if (activeSessionId) {
      await storageService.saveMessages(activeSessionId, [userMessage]);
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

      onMessage(aiMessage);

      if (activeSessionId) {
        await storageService.saveMessages(activeSessionId, [aiMessage]);
      } else {
        const newSession: ChatSession = {
          id: generateId(),
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          timestamp: new Date(),
          preview: content.slice(0, 80),
          messageCount: 2,
          messages: [userMessage, aiMessage],
        };
        onSessionSelected(newSession.id);
        onSessionCreated(newSession);
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
  };

  return { isLoading, error, sendMessage };
}
