import { type ContentType } from "@/types";
import { type AIService } from "@/services";
import { AI_RESPONSES } from "@/constants";

export class MockAIService implements AIService {
  private readonly delayMs: number;

  constructor(delayMs = 1500) {
    this.delayMs = delayMs;
  }

  async generateResponse(
    _content: string,
    contentType: ContentType,
  ): Promise<string> {
    await this.simulateDelay();
    const responses = AI_RESPONSES[contentType];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delayMs));
  }
}
