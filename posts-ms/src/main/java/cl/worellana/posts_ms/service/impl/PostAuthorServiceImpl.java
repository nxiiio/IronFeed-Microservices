package cl.worellana.posts_ms.service.impl;

import cl.worellana.posts_ms.client.UsersClient;
import cl.worellana.posts_ms.model.dto.response.PostAuthorResponse;
import cl.worellana.posts_ms.service.PostAuthorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PostAuthorServiceImpl implements PostAuthorService {

    private static final Logger logger = LoggerFactory.getLogger(PostAuthorServiceImpl.class);

    private final UsersClient usersClient;

    public PostAuthorServiceImpl(UsersClient usersClient) {
        this.usersClient = usersClient;
    }

    @Override
    public PostAuthorResponse findAuthorById(UUID authorId) {
        if (authorId == null) {
            return null;
        }

        return findAuthorsByIds(List.of(authorId)).get(authorId);
    }

    @Override
    public Map<UUID, PostAuthorResponse> findAuthorsByIds(List<UUID> authorIds) {
        if (authorIds == null) {
            return Map.of();
        }

        List<UUID> safeAuthorIds = authorIds.stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if (safeAuthorIds.isEmpty()) {
            return Map.of();
        }

        try {
            List<PostAuthorResponse> authors = usersClient.findAllByIds(safeAuthorIds).stream()
                    .map(PostAuthorResponse::from)
                    .filter(Objects::nonNull)
                    .filter(author -> author.getId() != null)
                    .toList();

            return authors.stream()
                    .collect(Collectors.toMap(
                            PostAuthorResponse::getId,
                            Function.identity(),
                            (firstAuthor, duplicatedAuthor) -> firstAuthor
                    ));
        } catch (Exception ex) {
            logger.warn("authors_lookup_failed authorIds={}", safeAuthorIds, ex);
            return Map.of();
        }
    }
}
