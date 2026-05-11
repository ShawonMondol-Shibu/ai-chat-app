"use client";

import { memo } from "react";
import { type ChatSession } from "@/types";
import { cn } from "@/lib";
import { motion } from "framer-motion";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { slideInLeft } from "@/constants";

interface ChatHistoryItemProps {
  chat: ChatSession;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export const ChatHistoryItem = memo(function ChatHistoryItem({
  chat,
  isActive = false,
  onClick,
  onDelete,
}: ChatHistoryItemProps) {
  return (
    <motion.div
      initial={slideInLeft.initial}
      animate={slideInLeft.animate}
      exit={slideInLeft.exit}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted",
      )}
    >
      <MessageSquare
        className={cn(
          "h-4 w-4 flex-shrink-0",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">
          {chat.title}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {chat.preview} •{" "}
          {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="ml-auto h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
});
