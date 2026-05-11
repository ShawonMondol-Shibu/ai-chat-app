"use client";

import { memo, useState } from "react";
import { ContentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { ContentTypeSelector } from "./content-type-selector";
import { cn, formatFileSize } from "@/lib";
import { motion } from "framer-motion";
import { Send, Paperclip, X, File as FileIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fadeInDown, transitionSlow } from "@/constants";

interface ChatInputProps {
  onSend: (content: string, contentType: ContentType) => void;
  isLoading?: boolean;
  className?: string;
}

interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

export const ChatInput = memo(function ChatInput({
  onSend,
  isLoading = false,
  className,
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.GENERAL,
  );
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);

  const handleSend = () => {
    if (content.trim() && !isLoading) {
      onSend(content.trim(), contentType);
      setContent("");
      setAttachedFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setAttachedFile({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    };
    input.click();
  };

  return (
    <motion.div
      initial={fadeInDown.initial}
      animate={fadeInDown.animate}
      transition={transitionSlow}
      className={cn(
        "border-t bg-background/80 backdrop-blur-lg",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 p-4">
        {attachedFile && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2"
          >
            <FileIcon className="h-4 w-4 text-primary" />
            <span className="flex-1 text-sm">
              {attachedFile.name} ({formatFileSize(attachedFile.size)})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAttachedFile(null)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-lg">
          <ContentTypeSelector
            value={contentType}
            onChange={setContentType}
            className="border-0"
          />

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />

          <Tooltip>
            <TooltipTrigger
              onClick={handleFileAttach}
              disabled={isLoading}
              className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-10 w-10 rounded-full hover:bg-muted hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach a file</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              onClick={handleSend}
              disabled={(!content.trim() && !attachedFile) || isLoading}
              className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              {isLoading ? (
                <Spinner className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message (Enter)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
});
