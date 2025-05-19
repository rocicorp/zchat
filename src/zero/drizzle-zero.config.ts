import { drizzleZeroConfig } from "drizzle-zero";
import * as drizzleSchema from "../db/schema";

export default drizzleZeroConfig(drizzleSchema, {
  tables: {
    threadsTable: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
    messagesTable: {
      id: true,
      content: true,
      threadId: true,
      type: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
  },
});
