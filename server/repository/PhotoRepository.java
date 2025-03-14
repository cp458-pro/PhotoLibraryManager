
package server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import server.model.Photo;

public interface PhotoRepository extends MongoRepository<Photo, String> {
    // Add custom query methods if needed
}
