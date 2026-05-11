"use client";

import { ContentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ContentTypeSelector } from "./content-type-selector";
import { cn, formatFileSize } from "@/lib";
import { motion } from "framer-motion";
import { Send, Paperclip, X, File as FileIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAutoResizeTextarea } from "@/hooks";
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

export function ChatInput({
  onSend,
  isLoading = false,
  className,
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.GENERAL,
  );
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const { textareaRef, resize } = useAutoResizeTextarea();

  useEffect(() => {
    resize();
  }, [content, resize]);

  const handleSend = () => {
    if (content.trim() && !isLoading) {
      onSend(content.trim(), contentType);
      setContent("");
      setAttachedFile(null);
      resize();
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
        "fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg",
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
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />

          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFileAttach}
                className="h-10 w-10 shrink-0 rounded-full"
                disabled={isLoading}
              >
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach a file</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={(!content.trim() && !attachedFile) || isLoading}
                className="h-10 w-10 shrink-0 rounded-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-25"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-75"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message (Enter)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}
