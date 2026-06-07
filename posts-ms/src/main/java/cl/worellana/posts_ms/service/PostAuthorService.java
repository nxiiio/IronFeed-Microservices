package cl.worellana.posts_ms.service;

import cl.worellana.posts_ms.model.dto.response.PostAuthorResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface PostAuthorService {

    PostAuthorResponse findAuthorById(UUID authorId);

    Map<UUID, PostAuthorResponse> findAuthorsByIds(List<UUID> authorIds);
}
