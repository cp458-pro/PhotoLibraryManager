
import sharp from 'sharp';

export async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(300, 300, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 60 })
    .toBuffer();
}

export async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .jpeg({ quality: 90 })
    .toBuffer();
}
