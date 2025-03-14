import { type Photo } from "@shared/schema";
import PhotoCard from "./PhotoCard";

interface PhotoGridProps {
  photos?: Photo[];
  isLoading: boolean;
}

export default function PhotoGrid({ photos, isLoading }: PhotoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!photos?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No photos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}
