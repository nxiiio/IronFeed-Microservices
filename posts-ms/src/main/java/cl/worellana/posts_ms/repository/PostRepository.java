package cl.worellana.posts_ms.repository;

import cl.worellana.posts_ms.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    Page<Post> findAllByUserId(UUID userId, Pageable pageable);
}
