import gsap from "gsap";

export function createStaggerEntrance(
  container: string | Element,
  options?: {
    stagger?: number;
    duration?: number;
    from?: "top" | "bottom" | "left" | "right" | "scale";
    ease?: string;
  },
) {
  const {
    stagger = 0.08,
    duration = 0.5,
    from = "bottom",
    ease = "power3.out",
  } = options || {};

  const vars: gsap.TweenVars = {
    opacity: 0,
    duration,
    stagger,
    ease,
  };

  switch (from) {
    case "top":
      vars.y = -20;
      break;
    case "bottom":
      vars.y = 20;
      break;
    case "left":
      vars.x = -20;
      break;
    case "right":
      vars.x = 20;
      break;
    case "scale":
      vars.scale = 0.95;
      break;
  }

  return gsap.from(container, vars);
}

export function createMessageEntrance(
  element: string | Element,
  index: number,
) {
  return gsap.from(element, {
    opacity: 0,
    y: 16,
    scale: 0.98,
    duration: 0.4,
    delay: index * 0.06,
    ease: "power2.out",
    clearProps: "transform",
  });
}

export function createTypingAnimation(
  dots: string | Element[],
): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1, yoyo: true });
  tl.to(dots, {
    y: -6,
    duration: 0.3,
    stagger: 0.1,
    ease: "power1.inOut",
  });
  return tl;
}

export function createPulseAnimation(element: string | Element) {
  return gsap.to(element, {
    scale: 1.05,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });
}
