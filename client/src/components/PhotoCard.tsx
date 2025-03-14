import { type Photo } from "@shared/schema";
import { format } from "date-fns";
import { MapPin, Calendar, Tag, Camera, Aperture } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
          <img
            src={photo.url}
            alt={photo.title || ""}
            className="object-cover w-full h-full"
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {photo.title && (
          <h3 className="font-semibold mb-2">{photo.title}</h3>
        )}
        {photo.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {photo.description}
          </p>
        )}
        <div className="space-y-2">
          {photo.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{photo.location}</span>
            </div>
          )}
          {photo.takenAt && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(photo.takenAt), "PPP")}</span>
            </div>
          )}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4" />
              <div className="flex flex-wrap gap-1">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {photo.metadata?.image && (
            <div className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4" />
              <span>
                {photo.metadata.image.Make} {photo.metadata.image.Model}
              </span>
            </div>
          )}
          {photo.metadata?.exif && (
            <div className="flex items-center gap-2 text-sm">
              <Aperture className="h-4 w-4" />
              <span>
                f/{photo.metadata.exif.FNumber}, {photo.metadata.exif.ExposureTime}s, ISO {photo.metadata.exif.ISO}
              </span>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}