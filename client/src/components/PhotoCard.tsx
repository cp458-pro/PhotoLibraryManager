import { type Photo } from "@shared/schema";
import { format } from "date-fns";
import { MapPin, Calendar, Tag, Camera, Aperture } from "lucide-react";
import { motion } from "framer-motion";
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
        <motion.div 
          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0 transition-opacity"
            whileHover={{ opacity: 1 }}
          />
          <motion.img
            src={photo.url}
            alt={photo.title || ""}
            className="object-cover w-full h-full transform transition-transform duration-300"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
          />
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80"
        asChild
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {photo.title && (
            <motion.h3 
              className="font-semibold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {photo.title}
            </motion.h3>
          )}
          {photo.description && (
            <motion.p 
              className="text-sm text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {photo.description}
            </motion.p>
          )}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
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
                    <motion.span
                      key={tag}
                      className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tag}
                    </motion.span>
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
          </motion.div>
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
}