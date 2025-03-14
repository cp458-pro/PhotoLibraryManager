import exif from 'exif-reader';

export interface ExifMetadata {
  image?: {
    Make?: string;
    Model?: string;
    Software?: string;
    ModifyDate?: string;
  };
  exif?: {
    ISO?: number;
    FNumber?: number;
    ExposureTime?: number;
    FocalLength?: number;
    DateTimeOriginal?: string;
    GPSLatitude?: number;
    GPSLongitude?: number;
  };
}

export async function extractExifData(imageBuffer: Buffer): Promise<ExifMetadata | null> {
  try {
    // Check if it's a JPEG file
    if (imageBuffer.toString('hex', 0, 2) !== 'ffd8') {
      return null; // Not a JPEG file
    }

    const metadata = exif(imageBuffer);

    if (!metadata) {
      return null;
    }

    return {
      image: {
        Make: metadata.Image?.Make,
        Model: metadata.Image?.Model,
        Software: metadata.Image?.Software,
        ModifyDate: metadata.Image?.ModifyDate,
      },
      exif: {
        ISO: metadata.Exif?.ISO,
        FNumber: metadata.Exif?.FNumber,
        ExposureTime: metadata.Exif?.ExposureTime,
        FocalLength: metadata.Exif?.FocalLength,
        DateTimeOriginal: metadata.Exif?.DateTimeOriginal,
        GPSLatitude: metadata.Exif?.GPSLatitude,
        GPSLongitude: metadata.Exif?.GPSLongitude,
      }
    };
  } catch (error) {
    console.error('Error extracting EXIF data:', error);
    return null;
  }
}