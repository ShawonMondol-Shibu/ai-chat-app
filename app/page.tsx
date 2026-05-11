"use client";

import { useState, lazy, Suspense, useRef } from "react";
import {
  ChatProvider,
  SettingsProvider,
  AuthProvider,
  useChatContext,
  useAuthContext,
} from "@/contexts";
import { MockAIService, MockStorageService } from "@/services";
import { Header, Sidebar, ChatArea, ChatInput } from "@/components/chat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SettingsDialog = lazy(() =>
  import("@/components/settings").then((m) => ({ default: m.SettingsDialog })),
);

const aiService = new MockAIService();
const storageService = new MockStorageService();

function ChatLayout() {
  const { messages, sessions, activeSessionId, isLoading, sendMessage, createNewSession, selectSession, deleteSession } =
    useChatContext();
  const { user, signIn, signOut } = useAuthContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!layoutRef.current) return;
      gsap.from(layoutRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: layoutRef },
  );

  return (
    <TooltipProvider>
      <div ref={layoutRef} className="flex h-screen flex-col">
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

        <Suspense fallback={null}>
          <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </Suspense>
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
