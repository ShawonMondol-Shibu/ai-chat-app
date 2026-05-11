"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Message, type ChatSession, type ContentType } from "@/types";
import { generateId } from "@/lib";
import { type AIService, type ChatStorageService } from "@/services";

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
  storageService: ChatStorageService;
}

export function ChatProvider({
  children,
  aiService,
  storageService,
}: ChatProviderProps) {
  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const activeSessionIdRef = useRef(activeSessionId);
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => storageService.getSessions(),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", activeSessionId],
    queryFn: () =>
      activeSessionId
        ? storageService.getMessages(activeSessionId)
        : Promise.resolve([]),
    enabled: !!activeSessionId,
  });

  const selectSession = useCallback(
    (sessionId: string) => {
      setActiveSessionId(sessionId);
    },
    [],
  );

  const createNewSession = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (sessionId: string) => storageService.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async ({
      content,
      contentType,
    }: {
      content: string;
      contentType: ContentType;
    }) => {
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
        contentType,
      };

      const currentId = activeSessionIdRef.current;

      if (currentId) {
        await storageService.saveMessages(currentId, [userMessage]);
      }

      queryClient.setQueryData<Message[]>(
        ["messages", currentId],
        (prev) => [...(prev || []), userMessage],
      );

      const response = await aiService.generateResponse(content, contentType);

      const aiMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        contentType,
      };

      const sessionId = currentId || generateId();

      if (!currentId) {
        const newSession: ChatSession = {
          id: sessionId,
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          timestamp: new Date(),
          preview: content.slice(0, 80),
          messageCount: 2,
          messages: [userMessage, aiMessage],
        };
        setActiveSessionId(sessionId);
        await storageService.saveSession(newSession);
        await storageService.saveMessages(sessionId, [
          userMessage,
          aiMessage,
        ]);
        queryClient.setQueryData(["messages", sessionId], [
          userMessage,
          aiMessage,
        ]);
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
      } else {
        await storageService.saveMessages(sessionId, [aiMessage]);
        queryClient.setQueryData<Message[]>(
          ["messages", sessionId],
          (prev) => [...(prev || []), aiMessage],
        );
      }
    },
  });

  const sendMessage = useCallback(
    async (content: string, contentType: ContentType) => {
      if (!content.trim()) return;
      await sendMutation.mutateAsync({ content, contentType });
    },
    [sendMutation],
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessions,
        activeSessionId,
        isLoading: sendMutation.isPending,
        error: sendMutation.error?.message ?? null,
        sendMessage,
        createNewSession,
        selectSession,
        deleteSession: deleteMutation.mutate,
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
