package cl.worellana.posts_ms.service.impl;

import cl.worellana.posts_ms.exception.PostNotFoundException;
import cl.worellana.posts_ms.model.Post;
import cl.worellana.posts_ms.model.PostType;
import cl.worellana.posts_ms.model.dto.request.PostRequest;
import cl.worellana.posts_ms.model.dto.response.PostAuthorResponse;
import cl.worellana.posts_ms.model.dto.response.PostPageResponse;
import cl.worellana.posts_ms.model.dto.response.PostResponse;
import cl.worellana.posts_ms.repository.CommentRepository;
import cl.worellana.posts_ms.repository.PostRepository;
import cl.worellana.posts_ms.repository.ReactionRepository;
import cl.worellana.posts_ms.service.PostAuthorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PostServiceImplTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private ReactionRepository reactionRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostAuthorService postAuthorService;

    @InjectMocks
    private PostServiceImpl sut;

    // ─── create ───────────────────────────────────────────────────────────────

    @Test
    void create_savesPostAndReturnsResponseWithZeroCounts() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        PostRequest request = PostRequest.builder()
                .userId(userId)
                .type(PostType.WORKOUT)
                .workoutSessionId(sessionId)
                .caption("Leg day done")
                .build();

        Post savedPost = Post.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .type(PostType.WORKOUT)
                .workoutSessionId(sessionId)
                .caption("Leg day done")
                .createdAt(LocalDateTime.now())
                .build();

        PostAuthorResponse author = PostAuthorResponse.builder()
                .id(userId)
                .username("nxiio")
                .build();

        when(postRepository.save(any(Post.class))).thenReturn(savedPost);
        when(postAuthorService.findAuthorById(userId)).thenReturn(author);

        PostResponse response = sut.create(request);

        // verifica que los campos del request se mapearon correctamente al post guardado
        ArgumentCaptor<Post> captor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(captor.capture());
        Post captured = captor.getValue();
        assertThat(captured.getUserId()).isEqualTo(userId);
        assertThat(captured.getType()).isEqualTo(PostType.WORKOUT);
        assertThat(captured.getWorkoutSessionId()).isEqualTo(sessionId);
        assertThat(captured.getCaption()).isEqualTo("Leg day done");
        assertThat(captured.getCreatedAt()).isNotNull();

        // verifica que la respuesta tiene counts en cero y el autor resuelto
        assertThat(response.getReactionCount()).isZero();
        assertThat(response.getCommentCount()).isZero();
        assertThat(response.getAuthor()).isEqualTo(author);
    }

    // ─── findById ─────────────────────────────────────────────────────────────

    @Test
    void findById_whenPostExists_returnsResponseWithCountsAndAuthor() {
        UUID postId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        Post post = Post.builder()
                .id(postId)
                .userId(userId)
                .type(PostType.PROGRESS_PHOTO)
                .createdAt(LocalDateTime.now())
                .build();

        PostAuthorResponse author = PostAuthorResponse.builder()
                .id(userId)
                .username("nxiio")
                .build();

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(postAuthorService.findAuthorsByIds(List.of(userId))).thenReturn(Map.of(userId, author));
        when(reactionRepository.countByPostId(postId)).thenReturn(5L);
        when(commentRepository.countByPostId(postId)).thenReturn(3L);

        PostResponse response = sut.findById(postId);

        assertThat(response.getId()).isEqualTo(postId);
        assertThat(response.getReactionCount()).isEqualTo(5L);
        assertThat(response.getCommentCount()).isEqualTo(3L);
        assertThat(response.getAuthor()).isEqualTo(author);
    }

    @Test
    void findById_whenPostNotFound_throwsPostNotFoundException() {
        UUID postId = UUID.randomUUID();
        when(postRepository.findById(postId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sut.findById(postId))
                .isInstanceOf(PostNotFoundException.class);
    }

    // ─── delete ───────────────────────────────────────────────────────────────

    @Test
    void delete_whenPostExists_deletesCascadeAndRemovesPost() {
        UUID postId = UUID.randomUUID();
        when(postRepository.existsById(postId)).thenReturn(true);

        sut.delete(postId);

        // verifica que el borrado en cascada sigue el orden correcto: reactions → comments → post
        verify(reactionRepository).deleteByPostId(postId);
        verify(commentRepository).deleteByPostId(postId);
        verify(postRepository).deleteById(postId);
    }

    @Test
    void delete_whenPostNotFound_throwsAndDoesNotDeleteAnything() {
        UUID postId = UUID.randomUUID();
        when(postRepository.existsById(postId)).thenReturn(false);

        assertThatThrownBy(() -> sut.delete(postId))
                .isInstanceOf(PostNotFoundException.class);

        // verifica que ninguna operacion de borrado fue invocada
        verify(reactionRepository, never()).deleteByPostId(any());
        verify(commentRepository, never()).deleteByPostId(any());
        verify(postRepository, never()).deleteById(any());
    }

    // ─── findAll — clamping de paginacion ─────────────────────────────────────

    @Test
    void findAll_withNullPageAndSize_usesDefaultsPageOneSize20() {
        when(postRepository.findAll(any(PageRequest.class))).thenReturn(Page.empty());
        when(postAuthorService.findAuthorsByIds(any())).thenReturn(Map.of());

        sut.findAll(null, null);

        ArgumentCaptor<PageRequest> captor = ArgumentCaptor.forClass(PageRequest.class);
        verify(postRepository).findAll(captor.capture());
        PageRequest pr = captor.getValue();
        assertThat(pr.getPageNumber()).isZero();    // base 0: pagina 1 → indice 0
        assertThat(pr.getPageSize()).isEqualTo(20);
        assertThat(pr.getSort()).isEqualTo(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Test
    void findAll_withZeroOrNegativePage_clampsToOne() {
        when(postRepository.findAll(any(PageRequest.class))).thenReturn(Page.empty());
        when(postAuthorService.findAuthorsByIds(any())).thenReturn(Map.of());

        sut.findAll(0, 10);

        ArgumentCaptor<PageRequest> captor = ArgumentCaptor.forClass(PageRequest.class);
        verify(postRepository).findAll(captor.capture());
        // Math.max(0,1) = 1 → indice 0
        assertThat(captor.getValue().getPageNumber()).isZero();
    }

    @Test
    void findAll_withZeroOrNegativeSize_clampsToOne() {
        when(postRepository.findAll(any(PageRequest.class))).thenReturn(Page.empty());
        when(postAuthorService.findAuthorsByIds(any())).thenReturn(Map.of());

        sut.findAll(1, 0);

        ArgumentCaptor<PageRequest> captor = ArgumentCaptor.forClass(PageRequest.class);
        verify(postRepository).findAll(captor.capture());
        // Math.max(0,1) = 1
        assertThat(captor.getValue().getPageSize()).isEqualTo(1);
    }

    @Test
    void findAll_mapsPostsToResponseWithAuthors() {
        UUID userId = UUID.randomUUID();
        UUID postId = UUID.randomUUID();

        Post post = Post.builder()
                .id(postId)
                .userId(userId)
                .type(PostType.WORKOUT)
                .createdAt(LocalDateTime.now())
                .build();

        PostAuthorResponse author = PostAuthorResponse.builder()
                .id(userId)
                .username("nxiio")
                .build();

        PageImpl<Post> pageResult = new PageImpl<>(List.of(post), PageRequest.of(0, 20), 1);

        when(postRepository.findAll(any(PageRequest.class))).thenReturn(pageResult);
        when(postAuthorService.findAuthorsByIds(List.of(userId))).thenReturn(Map.of(userId, author));
        when(reactionRepository.countByPostId(postId)).thenReturn(2L);
        when(commentRepository.countByPostId(postId)).thenReturn(1L);

        PostPageResponse response = sut.findAll(1, 20);

        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1);
        PostResponse item = response.getItems().getFirst();
        assertThat(item.getId()).isEqualTo(postId);
        assertThat(item.getReactionCount()).isEqualTo(2L);
        assertThat(item.getCommentCount()).isEqualTo(1L);
        assertThat(item.getAuthor()).isEqualTo(author);
    }

    // ─── findAllByUserId ──────────────────────────────────────────────────────

    @Test
    void findAllByUserId_passesUserIdAndPageRequestToRepository() {
        UUID userId = UUID.randomUUID();
        when(postRepository.findAllByUserId(any(), any(PageRequest.class))).thenReturn(Page.empty());
        when(postAuthorService.findAuthorsByIds(any())).thenReturn(Map.of());

        sut.findAllByUserId(userId, 1, 10);

        // verifica que el userId y el PageRequest clampeado llegan al repositorio
        ArgumentCaptor<PageRequest> prCaptor = ArgumentCaptor.forClass(PageRequest.class);
        verify(postRepository).findAllByUserId(any(UUID.class), prCaptor.capture());
        assertThat(prCaptor.getValue().getPageNumber()).isZero();
        assertThat(prCaptor.getValue().getPageSize()).isEqualTo(10);
    }
}
