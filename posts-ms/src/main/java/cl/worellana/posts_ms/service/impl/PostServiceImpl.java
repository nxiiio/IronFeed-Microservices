package cl.worellana.posts_ms.service.impl;

import cl.worellana.posts_ms.exception.PostNotFoundException;
import cl.worellana.posts_ms.model.Post;
import cl.worellana.posts_ms.model.dto.request.PostRequest;
import cl.worellana.posts_ms.model.dto.response.PostAuthorResponse;
import cl.worellana.posts_ms.model.dto.response.PostPageResponse;
import cl.worellana.posts_ms.model.dto.response.PostResponse;
import cl.worellana.posts_ms.repository.CommentRepository;
import cl.worellana.posts_ms.repository.PostRepository;
import cl.worellana.posts_ms.repository.ReactionRepository;
import cl.worellana.posts_ms.service.PostAuthorService;
import cl.worellana.posts_ms.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final ReactionRepository reactionRepository;
    private final CommentRepository commentRepository;
    private final PostAuthorService postAuthorService;

    public PostServiceImpl(PostRepository postRepository,
                           ReactionRepository reactionRepository,
                           CommentRepository commentRepository,
                           PostAuthorService postAuthorService) {
        this.postRepository = postRepository;
        this.reactionRepository = reactionRepository;
        this.commentRepository = commentRepository;
        this.postAuthorService = postAuthorService;
    }

    @Override
    @Transactional
    public PostResponse create(PostRequest request) {
        Post post = Post.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .workoutSessionId(request.getWorkoutSessionId())
                .personalRecordId(request.getPersonalRecordId())
                .caption(request.getCaption())
                .imageUrl(request.getImageUrl())
                .createdAt(LocalDateTime.now())
                .build();

        Post savedPost = postRepository.save(post);
        return PostResponse.from(savedPost, 0, 0, postAuthorService.findAuthorById(savedPost.getUserId()));
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse findById(UUID id) {
        return postRepository.findById(id)
                .map(post -> toResponse(post, postAuthorService.findAuthorsByIds(List.of(post.getUserId()))))
                .orElseThrow(PostNotFoundException::new);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!postRepository.existsById(id)) {
            throw new PostNotFoundException();
        }

        reactionRepository.deleteByPostId(id);
        commentRepository.deleteByPostId(id);
        postRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public PostPageResponse findAll(Integer page, Integer size) {
        Page<Post> posts = postRepository.findAll(createPageRequest(page, size));
        return toPageResponse(posts);
    }

    @Override
    @Transactional(readOnly = true)
    public PostPageResponse findAllByUserId(UUID userId, Integer page, Integer size) {
        Page<Post> posts = postRepository.findAllByUserId(userId, createPageRequest(page, size));
        return toPageResponse(posts);
    }

    private PostResponse toResponse(Post post, Map<UUID, PostAuthorResponse> authorsById) {
        UUID postId = post.getId();
        return PostResponse.from(
                post,
                reactionRepository.countByPostId(postId),
                commentRepository.countByPostId(postId),
                authorsById.get(post.getUserId())
        );
    }

    private PageRequest createPageRequest(Integer page, Integer size) {
        int safePage = page != null ? Math.max(page, 1) : 1;
        int safeSize = size != null ? Math.max(size, 1) : 20;
        return PageRequest.of(safePage - 1, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    private PostPageResponse toPageResponse(Page<Post> posts) {
        Map<UUID, PostAuthorResponse> authorsById = postAuthorService.findAuthorsByIds(
                posts.getContent().stream()
                        .map(Post::getUserId)
                        .toList()
        );

        List<PostResponse> items = posts.getContent().stream()
                .map(post -> toResponse(post, authorsById))
                .toList();

        return PostPageResponse.from(posts, items);
    }
}
