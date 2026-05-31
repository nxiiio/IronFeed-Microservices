package cl.worellana.feed_ms.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedResponse {

    private List<FeedPostResponse> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
