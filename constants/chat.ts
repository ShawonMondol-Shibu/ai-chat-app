import { ContentType } from "@/types";
import { Code2, Sparkles, BookOpen, MessageSquare } from "lucide-react";

export const CONTENT_TYPE_OPTIONS = [
  {
    value: ContentType.CREATIVE,
    label: "Creative",
    icon: Sparkles,
    description: "Stories, poems, creative writing",
  },
  {
    value: ContentType.CODE,
    label: "Code",
    icon: Code2,
    description: "Programming, debugging, code review",
  },
  {
    value: ContentType.TECHNICAL,
    label: "Technical",
    icon: BookOpen,
    description: "Documentation, explanations, tutorials",
  },
  {
    value: ContentType.GENERAL,
    label: "General",
    icon: MessageSquare,
    description: "General questions and conversations",
  },
] as const;

export const QUICK_START_CARDS = [
  {
    icon: "💡",
    title: "Explain a concept",
    description: "Help me understand quantum computing",
  },
  {
    icon: "📝",
    title: "Write something",
    description: "Create a poem about nature",
  },
  {
    icon: "💻",
    title: "Debug code",
    description: "Help me fix this React component",
  },
  {
    icon: "🎯",
    title: "Get advice",
    description: "Tips for improving productivity",
  },
] as const;

export const AI_RESPONSES: Record<ContentType, string[]> = {
  [ContentType.CREATIVE]: [
    "That's a fascinating creative idea! Let me help you develop it further...",
    "I love your creativity! Here's what I think...",
  ],
  [ContentType.CODE]: [
    "Great question! Here's how you can approach this coding challenge...",
    "Let me help you with that code. Here's the solution...",
  ],
  [ContentType.TECHNICAL]: [
    "Excellent technical question! Let me break this down...",
    "Here's a detailed explanation of the concept...",
  ],
  [ContentType.GENERAL]: [
    "Thanks for your message! Here's my response...",
    "I'd be happy to help you with that...",
  ],
};
