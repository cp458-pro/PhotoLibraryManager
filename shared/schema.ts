import { pgTable, text, serial, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  firebaseUid: text("firebase_uid").notNull().unique()
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  takenAt: timestamp("taken_at"),
  location: text("location"),
  tags: text("tags").array(),
  metadata: jsonb("metadata")
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  photoUrl: true,
  firebaseUid: true
});

export const insertPhotoSchema = createInsertSchema(photos).pick({
  userId: true,
  url: true,
  title: true,
  description: true,
  takenAt: true,
  location: true,
  tags: true,
  metadata: true
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
