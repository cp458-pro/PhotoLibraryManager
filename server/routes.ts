import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPhotoSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Photo routes
  app.get("/api/photos", async (_req, res) => {
    const photos = await storage.getPhotos();
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