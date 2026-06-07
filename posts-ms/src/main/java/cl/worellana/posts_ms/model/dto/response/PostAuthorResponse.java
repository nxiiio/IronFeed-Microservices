package cl.worellana.posts_ms.model.dto.response;

import cl.worellana.posts_ms.client.dto.UserSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostAuthorResponse {

    private UUID id;
    private String username;
    private String name;
    private String lastname;
    private String bio;

    public static PostAuthorResponse from(UserSummaryResponse user) {
        if (user == null) {
            return null;
        }

        return PostAuthorResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .lastname(user.getLastname())
                .bio(user.getBio())
                .build();
    }
}
