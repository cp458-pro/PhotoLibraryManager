import type { Express } from "express";
import { createServer } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertPhotoSchema, insertAlbumSchema } from "@shared/schema";
import { extractExifData } from "./utils/exif";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

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

  // New endpoint for photo upload with EXIF extraction
  app.post("/api/photos/upload", upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      // Extract EXIF data
      const exifData = await extractExifData(req.file.buffer);

      // Create photo entry with metadata and automatically extracted tags
      const photoData = {
        url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        title: req.body.title,
        description: req.body.description,
        albumId: req.body.albumId ? Number(req.body.albumId) : undefined,
        location: exifData?.exif?.GPSLatitude && exifData?.exif?.GPSLongitude 
          ? `${exifData.exif.GPSLatitude},${exifData.exif.GPSLongitude}`
          : undefined,
        takenAt: exifData?.exif?.DateTimeOriginal 
          ? new Date(exifData.exif.DateTimeOriginal)
          : undefined,
        metadata: exifData,
        tags: exifData?.exif?.Keywords || []
      };

      const insertedPhoto = await storage.createPhoto(photoData);
      res.json(insertedPhoto);
    } catch (error: any) {
      console.error('Error uploading photo:', error);
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