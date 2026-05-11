"use client";

import { memo, useRef, useEffect, useState } from "react";

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

  useEffect(() => {
    setDisplayed("");

    const chars = text.split("");
    let i = 0;

    const animate = () => {
      if (i < chars.length) {
        setDisplayed(chars.slice(0, i + 1).join(""));
        i++;
        frameRef.current = window.setTimeout(animate, speed);
      } else {
        onComplete?.();
      }
    };

    frameRef.current = window.setTimeout(animate, speed);

    return () => {
      if (frameRef.current !== null) clearTimeout(frameRef.current);
    };
  }, [text, speed, onComplete]);

  return <span>{displayed}</span>;
});
