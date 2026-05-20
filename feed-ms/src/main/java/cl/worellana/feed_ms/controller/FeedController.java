package cl.worellana.feed_ms.controller;

import cl.worellana.feed_ms.model.dto.response.FeedResponse;
import cl.worellana.feed_ms.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping
    public ResponseEntity<FeedResponse> findGlobalFeed(@RequestParam(defaultValue = "1") int page,
                                                       @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(feedService.findGlobalFeed(page, size));
    }
}
