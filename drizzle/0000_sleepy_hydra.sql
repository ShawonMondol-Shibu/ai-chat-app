CREATE TABLE "messages" (
	"id" text NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"content_type" text,
	"timestamp" text NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "messages_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"preview" text NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"timestamp" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" text PRIMARY KEY NOT NULL,
	"data" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;