import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { AuthService } from '../../../../core/auth';
import { SidebarNav } from '../../../../shared/components/sidebar-nav/sidebar-nav';
import { AppUser, Post, PostComment } from '../../../../shared/models';
import { PostsService } from '../../../../core/services/posts.service';
import { UsersService } from '../../../../core/services/users.service';
import { CommentForm } from '../../components/comment-form/comment-form';
import { CommentList } from '../../components/comment-list/comment-list';
import { PostDetailCard } from '../../components/post-detail-card/post-detail-card';

@Component({
  selector: 'app-post-detail-page',
  imports: [RouterLink, SidebarNav, PostDetailCard, CommentForm, CommentList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-detail-page.html',
  styleUrl: './post-detail-page.css'
})
export class PostDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly postsService = inject(PostsService);
  private readonly usersService = inject(UsersService);

  readonly currentPostId = signal<string | null>(null);
  readonly post = signal<Post | null>(null);
  readonly comments = signal<PostComment[]>([]);
  readonly commentAuthors = signal<AppUser[]>([]);
  readonly isLoading = signal(true);
  readonly isSubmittingComment = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly commentsErrorMessage = signal<string | null>(null);
  readonly authorsErrorMessage = signal<string | null>(null);
  readonly createCommentErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('postId');

    if (!postId) {
      this.isLoading.set(false);
      this.errorMessage.set('No se encontro la publicación.');
      return;
    }

    this.loadPostDetail(postId);
  }

  loadPostDetail(postId: string): void {
    this.currentPostId.set(postId);
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.commentsErrorMessage.set(null);
    this.authorsErrorMessage.set(null);

    forkJoin({
      post: this.postsService.findById(postId),
      comments: this.loadComments(postId)
    }).pipe(
      switchMap(({ post, comments }) =>
        this.loadCommentAuthors(comments).pipe(
          map((authors) => ({ post, comments, authors }))
        )
      )
    ).subscribe({
      next: ({ post, comments, authors }) => {
        this.post.set(post);
        this.comments.set(comments);
        this.commentAuthors.set(authors);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar esta publicación.');
        this.isLoading.set(false);
      }
    });
  }

  createComment(content: string): void {
    const currentUser = this.authService.currentUser();
    const postId = this.currentPostId();
    const errorMessage = 'No pudimos publicar tu comentario. Por favor, intenta de nuevo.';

    if (!currentUser || !postId) {
      this.createCommentErrorMessage.set(errorMessage);
      return;
    }

    this.isSubmittingComment.set(true);
    this.createCommentErrorMessage.set(null);

    this.postsService.createComment(postId, {
      userId: currentUser.id,
      content
    }).subscribe({
      next: () => {
        this.isSubmittingComment.set(false);
        this.loadPostDetail(postId);
      },
      error: () => {
        this.isSubmittingComment.set(false);
        this.createCommentErrorMessage.set(errorMessage);
      }
    });
  }

  private loadComments(postId: string): Observable<PostComment[]> {
    return this.postsService.findCommentsByPostId(postId).pipe(
      catchError(() => {
        this.commentsErrorMessage.set('No pudimos cargar los comentarios.');
        return of<PostComment[]>([]);
      })
    );
  }

  private loadCommentAuthors(comments: PostComment[]): Observable<AppUser[]> {
    const authorIds = Array.from(new Set(comments.map((comment) => comment.authorId)));

    if (authorIds.length === 0) {
      return of<AppUser[]>([]);
    }

    return this.usersService.findByIds(authorIds).pipe(
      catchError(() => {
        this.authorsErrorMessage.set('No pudimos cargar los autores de algunos comentarios.');
        return of<AppUser[]>([]);
      })
    );
  }
}
