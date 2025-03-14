import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPhotoSchema, insertAlbumSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Album routes
  app.get("/api/albums", async (_req, res) => {
    const albums = await storage.getAlbums();
    res.json(albums);
  });

  app.post("/api/albums", async (req, res) => {
    try {
      const albumData = insertAlbumSchema.parse(req.body);
      const album = await storage.createAlbum(albumData);
      res.json(album);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/albums/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertAlbumSchema.partial().parse(req.body);
      const album = await storage.updateAlbum(id, updates);
      res.json(album);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/albums/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteAlbum(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Photo routes
  app.get("/api/photos", async (req, res) => {
    const albumId = req.query.albumId ? Number(req.query.albumId) : undefined;
    const photos = await storage.getPhotos({ albumId });
    res.json(photos);
  });

  app.post("/api/photos", async (req, res) => {
    try {
      const photoData = insertPhotoSchema.parse(req.body);
      const photo = await storage.createPhoto(photoData);
      res.json(photo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/photos/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertPhotoSchema.partial().parse(req.body);
      const photo = await storage.updatePhoto(id, updates);
      res.json(photo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/photos/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deletePhoto(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return server;
}