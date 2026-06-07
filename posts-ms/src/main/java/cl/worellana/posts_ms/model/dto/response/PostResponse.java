package cl.worellana.posts_ms.model.dto.response;

import cl.worellana.posts_ms.model.Post;
import cl.worellana.posts_ms.model.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private UUID id;
    private UUID authorId;
    private PostType type;
    private UUID workoutSessionId;
    private UUID personalRecordId;
    private String caption;
    private String imageUrl;
    private LocalDateTime createdAt;
    private long reactionCount;
    private long commentCount;
    private PostAuthorResponse author;

    public static PostResponse from(Post post, long reactionCount, long commentCount) {
        return from(post, reactionCount, commentCount, null);
    }

    public static PostResponse from(Post post, long reactionCount, long commentCount, PostAuthorResponse author) {
        return PostResponse.builder()
                .id(post.getId())
                .authorId(post.getUserId())
                .type(post.getType())
                .workoutSessionId(post.getWorkoutSessionId())
                .personalRecordId(post.getPersonalRecordId())
                .caption(post.getCaption())
                .imageUrl(post.getImageUrl())
                .createdAt(post.getCreatedAt())
                .reactionCount(reactionCount)
                .commentCount(commentCount)
                .author(author)
                .build();
    }
}
