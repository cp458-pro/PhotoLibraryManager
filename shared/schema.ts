import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coverPhotoId: serial("cover_photo_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  albumId: serial("album_id").references(() => albums.id),
  takenAt: timestamp("taken_at"),
  location: text("location"),
  tags: text("tags").array(),
  metadata: jsonb("metadata"),
  favorite: text("favorite").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertAlbumSchema = createInsertSchema(albums).pick({
  name: true,
  description: true,
  coverPhotoId: true
});

export const insertPhotoSchema = createInsertSchema(photos).pick({
  url: true,
  title: true,
  description: true,
  albumId: true,
  takenAt: true,
  location: true,
  tags: true,
  metadata: true,
  favorite: true
});

export type Album = typeof albums.$inferSelect;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;