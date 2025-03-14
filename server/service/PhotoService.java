package server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import server.model.Photo;
import server.repository.PhotoRepository;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class PhotoService {
    @Autowired
    private PhotoRepository photoRepository;
    @Autowired
    private ImageProcessor imageProcessor;

    public List<Photo> getAllPhotos() {
        return photoRepository.findAll();
    }

    public Photo getPhoto(String id) {
        return photoRepository.findById(id).orElse(null);
    }

    public Photo savePhoto(MultipartFile file) throws IOException {
        byte[] originalBytes = file.getBytes();
        byte[] thumbnailBytes = imageProcessor.generateThumbnail(originalBytes);
        byte[] optimizedBytes = imageProcessor.optimizeImage(originalBytes);

        String thumbnailPath = saveImageFile(thumbnailBytes, "thumb_" + file.getOriginalFilename());
        String optimizedPath = saveImageFile(optimizedBytes, file.getOriginalFilename());

        Photo photo = new Photo();
        photo.setUrl(optimizedPath);
        photo.setThumbnailUrl(thumbnailPath);

        return photoRepository.save(photo);
    }

    private String saveImageFile(byte[] bytes, String filename) {
        // Implement file saving logic here
        return "/uploads/" + filename;
    }

    public void deletePhoto(String id) {
        photoRepository.deleteById(id);
    }
}