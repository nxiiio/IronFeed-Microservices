package cl.worellana.feed_ms.client;

import cl.worellana.feed_ms.model.dto.response.AuthorResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "users-ms", url = "${clients.users-ms.url}")
public interface UsersClient {

    @GetMapping("/api/users/{id}")
    AuthorResponse findById(@PathVariable("id") UUID id);
}
