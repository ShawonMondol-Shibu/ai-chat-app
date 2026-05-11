"use client";

import { useState } from "react";
import {
  ChatProvider,
  SettingsProvider,
  AuthProvider,
  useChatContext,
  useAuthContext,
} from "@/contexts";
import { MockAIService, MockStorageService } from "@/services";
import { Header, Sidebar, ChatArea, ChatInput } from "@/components/chat";
import { SettingsDialog } from "@/components/settings";
import { TooltipProvider } from "@/components/ui/tooltip";

const aiService = new MockAIService();
const storageService = new MockStorageService();

function ChatLayout() {
  const { messages, sessions, activeSessionId, isLoading, sendMessage, createNewSession, selectSession, deleteSession } =
    useChatContext();
  const { user, signIn, signOut } = useAuthContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col">
        <Header
          user={user}
          onSignIn={signIn}
          onSignOut={signOut}
          onSettings={() => setSettingsOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            chatHistory={sessions}
            activeChatId={activeSessionId}
            isCollapsed={isSidebarCollapsed}
            onNewChat={createNewSession}
            onChatSelect={selectSession}
            onChatDelete={deleteSession}
            onSettingsClick={() => setSettingsOpen(true)}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          <ChatArea messages={messages} isLoading={isLoading} />
        </div>

        <ChatInput onSend={sendMessage} isLoading={isLoading} />

        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </TooltipProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <ChatProvider aiService={aiService} storageService={storageService}>
        <SettingsProvider storageService={storageService}>
          <ChatLayout />
        </SettingsProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
