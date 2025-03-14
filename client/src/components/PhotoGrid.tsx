import React from 'react';
import { motion } from 'framer-motion';
import { type Photo } from "@shared/schema";

interface PhotoGridProps {
  photos: Photo[];
  isLoading: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, isLoading }) => {
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null);

  if (isLoading) {
    return (
      <div className="photo-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="photo-card loading"> </div>
        ))}
      </div>
    );
  }

  if (!photos?.length) {
    return (
      <div className="no-photos">
        <p>No photos found</p>
      </div>
    );
  }

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="photo-card"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <img src={photo.url} alt={photo.title} />
            <div className="photo-title">{photo.title}</div>
          </motion.div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="modal" onClick={() => setSelectedPhoto(null)}>
          <img src={selectedPhoto.url} alt={selectedPhoto.title} />
        </div>
      )}
    </>
  );
};

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive grid */
  grid-gap: 20px;
}

.photo-card {
  border-radius: 8px;
  overflow: hidden;
  position: relative; /* For positioning the title */
}

.photo-card img {
  width: 100%;
  height: auto;
  display: block; /* Prevents extra space below image */
}

.photo-title {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
}


.photo-card.loading {
  width: 100%;
  height: 200px; /* Adjust as needed */
  background-color: #eee;
  animation: loading-pulse 1s infinite;
}

@keyframes loading-pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.no-photos {
  text-align: center;
  padding: 2em 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal img {
  max-width: 90%;
  max-height: 90%;
}