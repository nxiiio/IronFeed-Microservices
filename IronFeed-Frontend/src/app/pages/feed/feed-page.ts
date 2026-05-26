import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';

import { FeedHeader } from '../../components/feed-header/feed-header';
import { FeedLoadingSkeleton } from '../../components/feed-loading-skeleton/feed-loading-skeleton';
import { FeedPagination } from '../../components/feed-pagination/feed-pagination';
import { FeaturedExercises } from '../../components/featured-exercises/featured-exercises';
import { PostComposer } from '../../components/post-composer/post-composer';
import { PostList } from '../../components/post-list/post-list';
import { SidebarNav } from '../../components/sidebar-nav/sidebar-nav';
import { AppUser, Exercise, Post } from '../../models';
import { ExercisesService } from '../../services/exercises.service';
import { PostsService } from '../../services/posts.service';
import { ToastService } from '../../services/toast.service';
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
  readonly users = signal<AppUser[]>([]);
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly exercisesErrorMessage = signal<string | null>(null);
  readonly usersErrorMessage = signal<string | null>(null);

  // Paginacion
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly pageSize = 10;

  readonly visibleTotalPages = computed(() => Math.max(this.totalPages(), 1));
  readonly canGoPrevious = computed(() => this.currentPage() > 1 && !this.isLoading());
  readonly canGoNext = computed(() =>
    this.totalPages() > 0 && this.currentPage() < this.totalPages() && !this.isLoading()
  );

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(page = this.currentPage()): void {
    const requestedPage = Math.max(page, 1);

    this.isLoading.set(true);
    this.currentPage.set(requestedPage);
    this.errorMessage.set(null);
    this.exercisesErrorMessage.set(null);
    this.usersErrorMessage.set(null);

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
      feed: this.postsService.findPage(requestedPage, this.pageSize),
      users: this.usersService.findAll().pipe(
        catchError(() => {
          const message = 'No pudimos cargar los usuarios. Algunos posts pueden aparecer sin autor.';

          this.usersErrorMessage.set(message);
          this.toastService.showError(message, 'Usuarios no disponibles');

          return of([]);
        })
      )
    }).subscribe({
      next: ({ exercises, feed, users }) => {
        this.exercises.set(exercises.slice(0, 3));
        this.posts.set(feed.items);
        this.currentPage.set(feed.page);
        this.totalPages.set(feed.totalPages);
        this.totalElements.set(feed.totalElements);
        this.users.set(users);
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

  // Botones de paginación
  goToPreviousPage(): void {
    if (!this.canGoPrevious()) {
      return;
    }

    this.loadFeed(this.currentPage() - 1);
  }

  goToNextPage(): void {
    if (!this.canGoNext()) {
      return;
    }

    this.loadFeed(this.currentPage() + 1);
  }
}
