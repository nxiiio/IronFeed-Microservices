package cl.worellana.users_ms.model.dto;

import cl.worellana.users_ms.model.AppUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {

    private UUID id;
    private String username;
    private String name;
    private String lastname;
    private String bio;

    public static UserSummaryResponse from(AppUser user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .lastname(user.getLastname())
                .bio(user.getBio())
                .build();
    }
}
