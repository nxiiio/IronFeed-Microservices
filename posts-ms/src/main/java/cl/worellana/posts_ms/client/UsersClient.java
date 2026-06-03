package cl.worellana.posts_ms.client;

import cl.worellana.posts_ms.client.dto.UserSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "users-ms", url = "${services.users.url}")
public interface UsersClient {

    @GetMapping("/api/users/summaries")
    List<UserSummaryResponse> findAllByIds(@RequestParam("ids") List<UUID> ids);
}
