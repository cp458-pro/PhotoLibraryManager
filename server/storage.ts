import { type Photo, type InsertPhoto } from "@shared/schema";

export interface IStorage {
  getPhotos(): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private photos: Map<number, Photo>;
  private photoIdCounter: number;

  constructor() {
    this.photos = new Map();
    this.photoIdCounter = 1;
  }

  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values());
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.photoIdCounter++;
    const photo: Photo = { ...insertPhoto, id };
    this.photos.set(id, photo);
    return photo;
  }

  async updatePhoto(id: number, updates: Partial<InsertPhoto>): Promise<Photo> {
    const existing = await this.getPhoto(id);
    if (!existing) throw new Error("Photo not found");

    const updated = { ...existing, ...updates };
    this.photos.set(id, updated);
    return updated;
  }

  async deletePhoto(id: number): Promise<void> {
    this.photos.delete(id);
  }
}

export const storage = new MemStorage();