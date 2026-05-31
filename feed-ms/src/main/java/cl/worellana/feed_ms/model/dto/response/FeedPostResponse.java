package cl.worellana.feed_ms.model.dto.response;

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
public class FeedPostResponse {

    private UUID id;
    private AuthorResponse author;
    private PostType type;
    private UUID workoutSessionId;
    private UUID personalRecordId;
    private String caption;
    private String imageUrl;
    private LocalDateTime createdAt;
    private long reactionCount;
    private long commentCount;
}
