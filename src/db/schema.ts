import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const threadsTable = pgTable("threads", {
  id: text().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const messageTypes = pgEnum("message_type", ["request", "response"]);

export const messagesTable = pgTable("messages", {
  id: text("id").primaryKey(),
  threadId: text("thread_id")
    .references(() => threadsTable.id)
    .notNull(),
  type: messageTypes("type").notNull(),
  content: text("content").notNull(),
  order: text("order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
