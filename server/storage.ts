import { type Album, type InsertAlbum, type Photo, type InsertPhoto } from "@shared/schema";

export interface IStorage {
  // Album operations
  getAlbums(): Promise<Album[]>;
  getAlbum(id: number): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  updateAlbum(id: number, album: Partial<InsertAlbum>): Promise<Album>;
  deleteAlbum(id: number): Promise<void>;

  // Photo operations
  getPhotos(options?: { albumId?: number }): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private albums: Map<number, Album>;
  private photos: Map<number, Photo>;
  private albumIdCounter: number;
  private photoIdCounter: number;

  constructor() {
    this.albums = new Map();
    this.photos = new Map();
    this.albumIdCounter = 1;
    this.photoIdCounter = 1;
  }

  // Album operations
  async getAlbums(): Promise<Album[]> {
    return Array.from(this.albums.values());
  }

  async getAlbum(id: number): Promise<Album | undefined> {
    return this.albums.get(id);
  }

  async createAlbum(insertAlbum: InsertAlbum): Promise<Album> {
    const id = this.albumIdCounter++;
    const album: Album = {
      ...insertAlbum,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.albums.set(id, album);
    return album;
  }

  async updateAlbum(id: number, updates: Partial<InsertAlbum>): Promise<Album> {
    const existing = await this.getAlbum(id);
    if (!existing) throw new Error("Album not found");

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.albums.set(id, updated);
    return updated;
  }

  async deleteAlbum(id: number): Promise<void> {
    this.albums.delete(id);
    // Update photos that were in this album
    for (const [photoId, photo] of this.photos.entries()) {
      if (photo.albumId === id) {
        this.photos.set(photoId, { ...photo, albumId: null });
      }
    }
  }

  // Photo operations
  async getPhotos(options?: { albumId?: number }): Promise<Photo[]> {
    let photos = Array.from(this.photos.values());
    if (options?.albumId) {
      photos = photos.filter(photo => photo.albumId === options.albumId);
    }
    return photos;
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.photoIdCounter++;
    const photo: Photo = {
      ...insertPhoto,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.photos.set(id, photo);
    return photo;
  }

  async updatePhoto(id: number, updates: Partial<InsertPhoto>): Promise<Photo> {
    const existing = await this.getPhoto(id);
    if (!existing) throw new Error("Photo not found");

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.photos.set(id, updated);
    return updated;
  }

  async deletePhoto(id: number): Promise<void> {
    this.photos.delete(id);
    // Update any albums that used this photo as cover
    for (const [albumId, album] of this.albums.entries()) {
      if (album.coverPhotoId === id) {
        this.albums.set(albumId, { ...album, coverPhotoId: null });
      }
    }
  }
}

export const storage = new MemStorage();