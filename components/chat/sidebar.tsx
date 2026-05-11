"use client";

import { memo } from "react";
import { type ChatSession } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatHistoryItem } from "./chat-history-item";
import { cn } from "@/lib";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { fadeInLeft, transitionSlow } from "@/constants";

interface SidebarProps {
  chatHistory: ChatSession[];
  activeChatId?: string | null;
  isCollapsed?: boolean;
  onNewChat?: () => void;
  onChatSelect?: (chatId: string) => void;
  onChatDelete?: (chatId: string) => void;
  onSettingsClick?: () => void;
  onToggleCollapse?: () => void;
}

export const Sidebar = memo(function Sidebar({
  chatHistory,
  activeChatId,
  isCollapsed = false,
  onNewChat,
  onChatSelect,
  onChatDelete,
  onSettingsClick,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <motion.aside
      initial={fadeInLeft.initial}
      animate={fadeInLeft.animate}
      transition={transitionSlow}
      className={cn(
        "flex h-full flex-col border-r bg-background",
        isCollapsed ? "w-16" : "w-72",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-muted-foreground"
          >
            Menu
          </motion.span>
        )}
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              isCollapsed
                ? "h-8 w-8 hover:bg-muted hover:text-foreground"
                : "h-8 gap-1.5 px-2.5 bg-primary text-primary-foreground hover:bg-primary/80",
            )}
            onClick={onNewChat}
          >
            <Plus className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">New Chat</span>}
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">
              <p>New Chat</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 pb-2"
        >
          <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
            <Tooltip>
              <TooltipTrigger
                className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 px-2.5 flex-1 hover:bg-muted hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
              >
                <MessageSquare className="mr-1 h-3.5 w-3.5" />
                Recent
              </TooltipTrigger>
              <TooltipContent>
                <p>Recent chats</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 px-2.5 flex-1 hover:bg-muted hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
              >
                <History className="mr-1 h-3.5 w-3.5" />
                Archive
              </TooltipTrigger>
              <TooltipContent>
                <p>Archived chats</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      )}

      <Separator className="my-2" />

      {!isCollapsed && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Chat History
            </h3>
          </div>

          <ScrollArea className="flex-1 px-2">
            <AnimatePresence>
              {chatHistory.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {chatHistory.map((chat) => (
                    <ChatHistoryItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === activeChatId}
                      onClick={() => onChatSelect?.(chat.id)}
                      onDelete={() => onChatDelete?.(chat.id)}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 opacity-20" />
                  <p>No chat history</p>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="text-sm"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </motion.div>
        )}

        <Tooltip>
          <TooltipTrigger
            onClick={onToggleCollapse}
            className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 ml-auto h-8 w-8 hover:bg-muted hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.aside>
  );
});
