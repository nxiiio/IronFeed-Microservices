package cl.worellana.posts_ms.controller;

import cl.worellana.posts_ms.model.dto.request.PostRequest;
import cl.worellana.posts_ms.model.dto.response.PostPageResponse;
import cl.worellana.posts_ms.model.dto.response.PostResponse;
import cl.worellana.posts_ms.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> create(@Valid @RequestBody PostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> findAll(@RequestParam(required = false) UUID userId) {
        if (userId == null) {
            return ResponseEntity.ok(postService.findAll());
        }
        return ResponseEntity.ok(postService.findAllByUserId(userId));
    }

    @GetMapping("/page")
    public ResponseEntity<PostPageResponse> findAllPaged(@RequestParam(required = false) UUID userId,
                                                         @RequestParam(defaultValue = "1") int page,
                                                         @RequestParam(defaultValue = "20") int size) {
        if (userId == null) {
            return ResponseEntity.ok(postService.findAll(page, size));
        }
        return ResponseEntity.ok(postService.findAllByUserId(userId, page, size));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> findById(@PathVariable UUID postId) {
        return ResponseEntity.ok(postService.findById(postId));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable UUID postId) {
        postService.delete(postId);
        return ResponseEntity.noContent().build();
    }
}
