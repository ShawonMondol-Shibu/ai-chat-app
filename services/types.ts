import { type ContentType } from "@/types";

export interface AIService {
  generateResponse(
    content: string,
    contentType: ContentType,
  ): Promise<string>;
}
