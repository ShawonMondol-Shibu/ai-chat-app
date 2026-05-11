"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseAutoResizeOptions {
  maxHeight?: number;
  defaultValue?: string;
}

export function useAutoResizeTextarea({
  maxHeight = 200,
  defaultValue = "",
}: UseAutoResizeOptions = {}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight,
      )}px`;
    }
  }, [maxHeight]);

  useEffect(() => {
    resize();
  }, [defaultValue, resize]);

  return { textareaRef, resize };
}
