import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type DateRange } from "react-day-picker";
import PhotoGrid from "@/components/PhotoGrid";
import PhotoFilters from "@/components/PhotoFilters";
import PhotoUpload from "@/components/PhotoUpload";
import { type Photo } from "@shared/schema";

interface PhotoFilters {
  dateRange: DateRange | null;
  location: string;
  tags: string[];
}

export default function Photos() {
  const [filters, setFilters] = useState<PhotoFilters>({
    dateRange: null,
    location: "",
    tags: []
  });

  const { data: photos = [], isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"]
  });

  const filteredPhotos = photos.filter(photo => {
    if (filters.location && photo.location && !photo.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    if (filters.tags.length > 0 && photo.tags) {
      if (!filters.tags.every(tag => photo.tags?.includes(tag))) {
        return false;
      }
    }

    if (filters.dateRange?.from && filters.dateRange?.to && photo.takenAt) {
      const photoDate = new Date(photo.takenAt);
      if (photoDate < filters.dateRange.from || photoDate > filters.dateRange.to) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Photo Library</h1>
        <PhotoUpload />
        <PhotoFilters filters={filters} onChange={setFilters} />
        <PhotoGrid photos={filteredPhotos} isLoading={isLoading} />
      </div>
    </div>
  );
}