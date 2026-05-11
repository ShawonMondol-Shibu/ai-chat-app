"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface PageEntranceOptions {
  duration?: number;
  stagger?: number;
}

export function usePageEntrance(options?: PageEntranceOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { duration = 0.5, stagger = 0.1 } = options || {};

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const children = containerRef.current.children;
      gsap.from(children, {
        opacity: 0,
        y: 20,
        duration,
        stagger,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  return containerRef;
}
