package cl.worellana.feed_ms.service.impl;

import cl.worellana.feed_ms.client.PostsClient;
import cl.worellana.feed_ms.model.dto.response.FeedResponse;
import cl.worellana.feed_ms.model.dto.response.PostPageResponse;
import cl.worellana.feed_ms.service.FeedService;
import org.springframework.stereotype.Service;

@Service
public class FeedServiceImpl implements FeedService {

    private final PostsClient postsClient;

    public FeedServiceImpl(PostsClient postsClient) {
        this.postsClient = postsClient;
    }

    @Override
    public FeedResponse findGlobalFeed(int page, int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.max(size, 1);
        PostPageResponse posts = postsClient.findAll(safePage, safeSize);

        return FeedResponse.builder()
                .items(posts.getItems())
                .page(posts.getPage())
                .size(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .build();
    }
}
