"use client";

import { type Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fadeInUp, transitionDefault } from "@/constants";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={transitionDefault}
      className={cn("flex w-full gap-4 p-4", isUser && "flex-row-reverse")}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={isUser ? undefined : "/ai-avatar.svg"} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-2",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </span>
      </div>
    </motion.div>
  );
}
