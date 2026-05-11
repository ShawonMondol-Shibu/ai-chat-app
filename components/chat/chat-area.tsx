"use client";

import { memo, useRef, useEffect } from "react";
import { type Message } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { QuickStartCard } from "./quick-start-card";
import {
  QUICK_START_CARDS,
  fadeInScale,
  fadeInUp,
  transitionSlow,
} from "@/constants";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ChatAreaProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatArea = memo(function ChatArea({
  messages,
  isLoading = false,
}: ChatAreaProps) {
  const hasMessages = messages.length > 0;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-start px-4 py-8">
          {!hasMessages ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}
              {isLoading && <LoadingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
});

function EmptyState() {
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!iconRef.current) return;
      gsap.to(iconRef.current, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: iconRef },
  );

  return (
    <motion.div
      initial={fadeInScale.initial}
      animate={fadeInScale.animate}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col items-center justify-center py-20"
    >
      <div
        ref={iconRef}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10"
      >
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold">Welcome to AI Chat</h2>
      <p className="max-w-md text-center text-muted-foreground">
        Start a conversation by typing a message below. Choose your content type
        for better responses.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {QUICK_START_CARDS.map((card) => (
          <QuickStartCard key={card.title} {...card} />
        ))}
      </div>
    </motion.div>
  );
}

function LoadingIndicator() {
  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={transitionSlow}
      className="flex w-full gap-4 p-4"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      </div>
    </motion.div>
  );
}
