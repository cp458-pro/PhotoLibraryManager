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
    Subject?: string[];
    Keywords?: string[];
    ImageDescription?: string;
  };
}

function extractTagsFromMetadata(metadata: any): string[] {
  const tags: Set<string> = new Set();

  // Extract from IPTC Keywords if available
  if (metadata.iptc?.Keywords) {
    metadata.iptc.Keywords.forEach((keyword: string) => tags.add(keyword.toLowerCase()));
  }

  // Extract from XMP Subject if available
  if (metadata.xmp?.Subject) {
    metadata.xmp.Subject.forEach((subject: string) => tags.add(subject.toLowerCase()));
  }

  // Extract from Image Description
  if (metadata.image?.ImageDescription) {
    const words = metadata.image.ImageDescription
      .split(/[,\s]+/)
      .map((word: string) => word.toLowerCase())
      .filter((word: string) => word.length > 3); // Only words longer than 3 chars
    words.forEach((word: string) => tags.add(word));
  }

  // Add camera info as tags
  if (metadata.image?.Make) {
    tags.add(metadata.image.Make.toLowerCase());
  }
  if (metadata.image?.Model) {
    tags.add(metadata.image.Model.toLowerCase());
  }

  return Array.from(tags);
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

    // Extract tags from various metadata fields
    const extractedTags = extractTagsFromMetadata(metadata);

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
        Keywords: extractedTags
      }
    };
  } catch (error) {
    console.error('Error extracting EXIF data:', error);
    return null;
  }
}