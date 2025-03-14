import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPhotoSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByFirebaseId(userData.firebaseUid);
      if (existingUser) {
        res.json(existingUser);
        return;
      }

      // Create new user if doesn't exist
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      console.error("User creation error:", error);
      res.status(400).json({ error: error.message || "Failed to create user" });
    }
  });

  app.get("/api/users/firebase/:firebaseUid", async (req, res) => {
    const user = await storage.getUserByFirebaseId(req.params.firebaseUid);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });

  // Photo routes
  app.get("/api/photos", async (req, res) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    const photos = await storage.getPhotos(userId);
    res.json(photos);
  });

  app.post("/api/photos", async (req, res) => {
    try {
      const photoData = insertPhotoSchema.parse(req.body);
      const photo = await storage.createPhoto(photoData);
      res.json(photo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/photos/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertPhotoSchema.partial().parse(req.body);
      const photo = await storage.updatePhoto(id, updates);
      res.json(photo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/photos/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deletePhoto(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return server;
}