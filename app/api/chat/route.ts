import "server-only";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ContentType } from "@/types";
import { auth } from "@/lib/auth";
import { AI_RESPONSES } from "@/constants";
import { chatRateLimiter } from "@/lib/rate-limiter";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const SYSTEM_PROMPTS: Record<string, string> = {
  [ContentType.CREATIVE]:
    "You are a creative writing assistant. Help users with stories, poems, and creative content. Be imaginative and expressive.",
  [ContentType.CODE]:
    "You are an expert programming assistant. Help with code, debugging, and software architecture. Provide clear, working code examples.",
  [ContentType.TECHNICAL]:
    "You are a technical writing expert. Provide clear documentation, explanations, and tutorials. Be precise and thorough.",
  [ContentType.GENERAL]:
    "You are a helpful AI assistant. Answer questions clearly and conversationally. Be concise but thorough.",
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = chatRateLimiter.check(`chat:${session.user.id}:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests", resetAt: rl.resetAt },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { message, contentType } = body;

    if (!message || !contentType) {
      return NextResponse.json(
        { error: "message and contentType are required" },
        { status: 400 },
      );
    }

    const systemPrompt =
      SYSTEM_PROMPTS[contentType] || SYSTEM_PROMPTS[ContentType.GENERAL];

    const response = await client.chat.completions.create({
      model: "gemini-3.1-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ response: reply });
  } catch (error: unknown) {
    const err = error as { status?: number; error?: { message?: string } };

    if (err.status === 429) {
      console.warn("OpenAI quota exceeded, using fallback responses");
      const fallback = pickFallback(ContentType.GENERAL);
      return NextResponse.json({ response: fallback });
    }

    console.error("Chat API error:", error);
    const fallback = pickFallback(ContentType.GENERAL);
    return NextResponse.json({ response: fallback });
  }
}

function pickFallback(contentType: ContentType): string {
  const fallbacks = AI_RESPONSES[contentType] || AI_RESPONSES[ContentType.GENERAL];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
