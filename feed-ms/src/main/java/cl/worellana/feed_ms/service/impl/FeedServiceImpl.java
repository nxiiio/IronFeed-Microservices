package cl.worellana.feed_ms.service.impl;

import cl.worellana.feed_ms.client.PostsClient;
import cl.worellana.feed_ms.client.UsersClient;
import cl.worellana.feed_ms.model.dto.response.AuthorResponse;
import cl.worellana.feed_ms.model.dto.response.FeedResponse;
import cl.worellana.feed_ms.model.dto.response.PostPageResponse;
import cl.worellana.feed_ms.model.dto.response.PostResponse;
import cl.worellana.feed_ms.service.FeedService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FeedServiceImpl implements FeedService {

    private final PostsClient postsClient;
    private final UsersClient usersClient;

    public FeedServiceImpl(PostsClient postsClient, UsersClient usersClient) {
        this.postsClient = postsClient;
        this.usersClient = usersClient;
    }

    @Override
    public FeedResponse findGlobalFeed(int page, int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.max(size, 1);
        PostPageResponse posts = postsClient.findAll(safePage, safeSize);
        Map<UUID, AuthorResponse> authorsById = findAuthorsByPostAuthorId(posts);
        
        posts.getItems().forEach(post -> post.setAuthor(authorsById.get(post.getAuthorId())));

        return FeedResponse.builder()
                .items(posts.getItems())
                .page(posts.getPage())
                .size(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .build();
    }

    private Map<UUID, AuthorResponse> findAuthorsByPostAuthorId(PostPageResponse posts) {
        Map<UUID, AuthorResponse> authorsById = new HashMap<>();

        for (PostResponse post : posts.getItems()) {
            UUID authorId = post.getAuthorId();

            if (authorId == null || authorsById.containsKey(authorId)) {
                continue;
            }

            authorsById.put(authorId, findAuthorSafely(authorId));
        }

        return authorsById;
    }

    private AuthorResponse findAuthorSafely(UUID authorId) {
        try {
            return usersClient.findById(authorId);
        } catch (RuntimeException exception) {
            return null;
        }
    }
}
