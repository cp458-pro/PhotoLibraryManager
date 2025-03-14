
package server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import server.model.Album;

public interface AlbumRepository extends MongoRepository<Album, String> {
    // Add custom query methods if needed
}
