package cl.worellana.feed_ms.client;

import cl.worellana.feed_ms.model.dto.response.PostPageResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "posts-ms", url = "${clients.posts-ms.url}")
public interface PostsClient {

    @GetMapping("/api/posts/page")
    PostPageResponse findAll(@RequestParam("page") int page,
                             @RequestParam("size") int size);
}
