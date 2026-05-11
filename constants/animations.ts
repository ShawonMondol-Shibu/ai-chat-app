import { type Transition } from "framer-motion";

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
} as const;

export const fadeInDown = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
} as const;

export const fadeInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
} as const;

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
} as const;

export const slideInLeft = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
} as const;

export const transitionDefault = { duration: 0.3 } satisfies Transition;
export const transitionSlow = { duration: 0.4 } satisfies Transition;
export const transitionFast = { duration: 0.2 } satisfies Transition;
