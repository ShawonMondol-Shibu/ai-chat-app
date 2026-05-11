import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  preview: text("preview").notNull(),
  messageCount: integer("message_count").notNull().default(0),
  timestamp: text("timestamp").notNull(),
  createdAt: text("created_at").notNull(),
});

export const messages = pgTable(
  "messages",
  {
    id: text("id").notNull(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    role: text("role", { enum: ["user", "assistant"] }).notNull(),
    content: text("content").notNull(),
    contentType: text("content_type"),
    timestamp: text("timestamp").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().default("default"),
  data: text("data").notNull(),
  updatedAt: text("updated_at").notNull(),
});
