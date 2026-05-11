"use client";

import { useState, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ChatProvider,
  SettingsProvider,
  AuthProvider,
  useChatContext,
  useAuthContext,
} from "@/contexts";
import { ApiAIService, ApiStorageService } from "@/services";
import { Header, Sidebar, ChatArea, ChatInput } from "@/components/chat";
import { ProfileDialog } from "@/components/profile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { motion } from "framer-motion";

const SettingsDialog = lazy(() =>
  import("@/components/settings").then((m) => ({ default: m.SettingsDialog })),
);

const aiService = new ApiAIService();
const storageService = new ApiStorageService();

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ChatLayout() {
  const { messages, sessions, activeSessionId, isLoading, error, sendMessage, createNewSession, selectSession, deleteSession } =
    useChatContext();
  const { user, signIn, signOut } = useAuthContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <TooltipProvider>
      <motion.div className="relative flex h-screen flex-col overflow-hidden" variants={containerVariants} initial="hidden" animate="visible">
        <DottedGlowBackground
          className="pointer-events-none -z-10"
          opacity={0.4}
          gap={16}
          radius={1.5}
          colorLightVar="--color-neutral-400"
          glowColorLightVar="--color-primary"
          colorDarkVar="--color-neutral-700"
          glowColorDarkVar="--color-primary"
          backgroundOpacity={0}
          speedMin={0.3}
          speedMax={1.5}
          speedScale={1}
        />
        <motion.div variants={childVariants} transition={{ duration: 0.5, type: "tween", ease: "easeOut" }}>
          <Header
            user={user}
            onSignIn={signIn}
            onSignOut={signOut}
            onSettings={() => setSettingsOpen(true)}
            onProfile={() => setProfileOpen(true)}
          />
        </motion.div>

        <motion.div variants={childVariants} transition={{ duration: 0.5, type: "tween", ease: "easeOut" }} className="flex flex-1 overflow-hidden min-h-0">
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

          <ChatArea messages={messages} isLoading={isLoading} error={error} />
        </motion.div>

        <motion.div variants={childVariants} transition={{ duration: 0.5, type: "tween", ease: "easeOut" }}>
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </motion.div>

        <Suspense fallback={null}>
          <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </Suspense>

        <ProfileDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          user={user}
          onSignOut={signOut}
        />
      </motion.div>
    </TooltipProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider aiService={aiService} storageService={storageService}>
          <SettingsProvider storageService={storageService}>
            {children}
          </SettingsProvider>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default function Home() {
  return (
    <Providers>
      <ChatLayout />
    </Providers>
  );
}
