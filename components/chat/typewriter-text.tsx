"use client";

import { memo, useRef, useEffect, useState } from "react";
import { MarkdownContent } from "./markdown-content";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterText = memo(function TypewriterText({
  text,
  speed = 20,
  onComplete,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const frameRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const chars = text.split("");
    let i = 0;

    const animate = () => {
      if (i < chars.length) {
        const next = chars.slice(0, i + 1).join("");
        setDisplayed(next);
        i++;
        frameRef.current = window.setTimeout(animate, speed);
      } else {
        onCompleteRef.current?.();
      }
    };

    frameRef.current = window.setTimeout(animate, speed);

    return () => {
      if (frameRef.current !== null) clearTimeout(frameRef.current);
    };
  }, [text, speed]);

  return <MarkdownContent text={displayed} />;
});
