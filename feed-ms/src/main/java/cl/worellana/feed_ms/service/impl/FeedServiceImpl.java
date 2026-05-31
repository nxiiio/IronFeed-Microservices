package cl.worellana.feed_ms.service.impl;

import cl.worellana.feed_ms.client.PostsClient;
import cl.worellana.feed_ms.client.UsersClient;
import cl.worellana.feed_ms.model.dto.response.AuthorResponse;
import cl.worellana.feed_ms.model.dto.response.FeedPostResponse;
import cl.worellana.feed_ms.model.dto.response.FeedResponse;
import cl.worellana.feed_ms.model.dto.response.PostPageResponse;
import cl.worellana.feed_ms.model.dto.response.PostResponse;
import cl.worellana.feed_ms.service.FeedService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

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

        return FeedResponse.builder()
                .items(enrichAuthors(posts.getItems()))
                .page(posts.getPage())
                .size(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .build();
    }

    private List<FeedPostResponse> enrichAuthors(List<PostResponse> posts) {
        Map<UUID, AuthorResponse> authorsById = findAuthorsById(posts);

        return posts.stream()
                .map(post -> toFeedPost(post, authorsById.get(post.getAuthorId())))
                .toList();
    }

    private FeedPostResponse toFeedPost(PostResponse post, AuthorResponse author) {
        return FeedPostResponse.builder()
                .id(post.getId())
                .author(author)
                .type(post.getType())
                .workoutSessionId(post.getWorkoutSessionId())
                .personalRecordId(post.getPersonalRecordId())
                .caption(post.getCaption())
                .imageUrl(post.getImageUrl())
                .createdAt(post.getCreatedAt())
                .reactionCount(post.getReactionCount())
                .commentCount(post.getCommentCount())
                .build();
    }

    private Map<UUID, AuthorResponse> findAuthorsById(List<PostResponse> posts) {
        List<UUID> authorIds = posts.stream()
                .map(PostResponse::getAuthorId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if (authorIds.isEmpty()) {
            return Map.of();
        }

        try {
            return usersClient.findAllById(authorIds).stream()
                    .collect(Collectors.toMap(AuthorResponse::getId, Function.identity()));
        } catch (RuntimeException ignored) {
            return Map.of();
        }
    }
}
