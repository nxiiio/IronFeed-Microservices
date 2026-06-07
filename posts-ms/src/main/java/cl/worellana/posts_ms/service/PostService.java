package cl.worellana.posts_ms.service;

import cl.worellana.posts_ms.model.dto.request.PostRequest;
import cl.worellana.posts_ms.model.dto.response.PostPageResponse;
import cl.worellana.posts_ms.model.dto.response.PostResponse;

import java.util.UUID;

public interface PostService {

    PostResponse create(PostRequest request);

    PostResponse findById(UUID id);

    void delete(UUID id);

    PostPageResponse findAll(Integer page, Integer size);

    PostPageResponse findAllByUserId(UUID userId, Integer page, Integer size);
}
