import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sessions, messages, settings } from "../db/schema";
import { DEFAULT_SETTINGS } from "../types";

const queryClient = postgres(process.env.DATABASE_URL || "");
const db = drizzle(queryClient);

async function seed() {
  console.log("Seeding database...");

  await db.delete(messages);
  await db.delete(sessions);
  await db.delete(settings);

  const now = new Date();

  await db.insert(sessions).values({
    id: "seed-session-1",
    userId: "seed",
    title: "Getting Started",
    preview: "Welcome to Shibu AI! How can I help you today?",
    messageCount: 2,
    timestamp: now.toISOString(),
    createdAt: now.toISOString(),
  });

  await db.insert(messages).values([
    {
      id: "seed-msg-1",
      sessionId: "seed-session-1",
      userId: "seed",
      role: "user",
      content: "Hello! What can you do?",
      contentType: "general",
      timestamp: now.toISOString(),
      createdAt: now.toISOString(),
    },
    {
      id: "seed-msg-2",
      sessionId: "seed-session-1",
      userId: "seed",
      role: "assistant",
      content:
        "I'm an AI assistant that can help you with creative writing, coding, technical explanations, and general questions. Try sending a message!",
      contentType: "general",
      timestamp: new Date(now.getTime() + 1000).toISOString(),
      createdAt: new Date(now.getTime() + 1000).toISOString(),
    },
  ]);

  await db.insert(settings).values({
    id: "default",
    userId: "default",
    data: JSON.stringify(DEFAULT_SETTINGS),
    updatedAt: now.toISOString(),
  });

  console.log("Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .then(() => process.exit(0));
