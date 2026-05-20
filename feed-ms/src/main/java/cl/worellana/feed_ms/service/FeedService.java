package cl.worellana.feed_ms.service;

import cl.worellana.feed_ms.model.dto.response.FeedResponse;

public interface FeedService {

    FeedResponse findGlobalFeed(int page, int size);
}
