import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { FeedHeader } from '../../components/feed-header/feed-header';
import { FeedLoadingSkeleton } from '../../components/feed-loading-skeleton/feed-loading-skeleton';
import { FeedPagination } from '../../components/feed-pagination/feed-pagination';
import { FeaturedExercises } from '../../components/featured-exercises/featured-exercises';
import { PostComposer } from '../../components/post-composer/post-composer';
import { PostList } from '../../components/post-list/post-list';
import { SidebarNav } from '../../components/sidebar-nav/sidebar-nav';
import { AppUser, Exercise, Post } from '../../../../shared/models';
import { ExercisesService } from '../../services/exercises.service';
import { PostsService } from '../../services/posts.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-feed-page',
  imports: [
    FeedHeader,
    FeedLoadingSkeleton,
    FeedPagination,
    FeaturedExercises,
    PostComposer,
    PostList,
    SidebarNav
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feed-page.html',
  styleUrl: './feed-page.css'
})
export class FeedPage implements OnInit {
  private readonly exercisesService = inject(ExercisesService);
  private readonly postsService = inject(PostsService);
  private readonly toastService = inject(ToastService);
  private readonly usersService = inject(UsersService);

  readonly exercises = signal<Exercise[]>([]);
  readonly authors = signal<AppUser[]>([]);
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly exercisesErrorMessage = signal<string | null>(null);
  readonly authorsErrorMessage = signal<string | null>(null);

  // Paginacion
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly pageSize = 10;

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(page = this.currentPage()): void {
    const requestedPage = Math.max(page, 1);

    this.isLoading.set(true);
    this.currentPage.set(requestedPage);
    this.errorMessage.set(null);
    this.exercisesErrorMessage.set(null);
    this.authorsErrorMessage.set(null);

    forkJoin({
      exercises: this.exercisesService.findAll().pipe(
        catchError(() => {
          const message = 'No pudimos cargar ejercicios destacados.';
          console.log("Error al cargar ejercicios:", message);

          this.exercisesErrorMessage.set(message);
          this.toastService.showError(message, 'Ejercicios no disponibles');

          return of([]);
        })
      ),
      feed: this.postsService.findPage(requestedPage, this.pageSize)
    }).pipe(
      switchMap(({ exercises, feed }) => {
        const authorIds = this.getUniqueAuthorIds(feed.items);

        if (authorIds.length === 0) {
          return of({ exercises, feed, authors: [] });
        }

        return this.usersService.findByIds(authorIds).pipe(
          map((authors) => ({ exercises, feed, authors })),
          catchError(() => {
            const message = 'No pudimos cargar los autores. Algunos posts pueden aparecer sin autor.';

            this.authorsErrorMessage.set(message);
            this.toastService.showError(message, 'Autores no disponibles');

            return of({ exercises, feed, authors: [] });
          })
        );
      })
    ).subscribe({
      next: ({ exercises, feed, authors }) => {
        this.exercises.set(exercises.slice(0, 3));
        this.posts.set(feed.items);
        this.authors.set(authors);
        this.currentPage.set(feed.page);
        this.totalPages.set(feed.totalPages);
        this.totalElements.set(feed.totalElements);
        this.isLoading.set(false);
      },
      error: () => {
        const message = 'No pudimos cargar los posts del feed.';

        this.errorMessage.set(message);
        this.toastService.showError(message, 'Feed no disponible');
        this.isLoading.set(false);
      }
    });
  }

  private getUniqueAuthorIds(posts: Post[]): string[] {
    return Array.from(new Set(posts.map((post) => post.authorId)));
  }
}
