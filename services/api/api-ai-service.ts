import { type ContentType } from "@/types";
import { type AIService } from "@/services";

export class ApiAIService implements AIService {
  async generateResponse(
    message: string,
    contentType: ContentType,
  ): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, contentType }),
    });

    if (!res.ok) {
      throw new Error("Failed to get AI response");
    }

    const data = await res.json();
    return data.response as string;
  }
}
