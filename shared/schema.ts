import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  takenAt: timestamp("taken_at"),
  location: text("location"),
  tags: text("tags").array(),
  metadata: jsonb("metadata")
});

export const insertPhotoSchema = createInsertSchema(photos).pick({
  url: true,
  title: true,
  description: true,
  takenAt: true,
  location: true,
  tags: true,
  metadata: true
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;