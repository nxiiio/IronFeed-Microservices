package cl.worellana.posts_ms.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostPageResponse {

    private List<PostResponse> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public static PostPageResponse from(Page<?> page, List<PostResponse> items) {
        return PostPageResponse.builder()
                .items(items)
                .page(page.getNumber() + 1)
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
