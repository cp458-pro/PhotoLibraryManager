import { type User, type InsertUser, type Photo, type InsertPhoto } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Photo operations
  getPhotos(userId: number): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private photos: Map<number, Photo>;
  private userIdCounter: number;
  private photoIdCounter: number;

  constructor() {
    this.users = new Map();
    this.photos = new Map();
    this.userIdCounter = 1;
    this.photoIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseId(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPhotos(userId: number): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter(
      (photo) => photo.userId === userId
    );
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
