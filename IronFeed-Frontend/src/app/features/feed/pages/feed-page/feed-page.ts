import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { AuthService } from '../../../../core/auth/services/auth.service';
import { FeedHeader } from '../../components/feed-header/feed-header';
import { FeedLoadingSkeleton } from '../../components/feed-loading-skeleton/feed-loading-skeleton';
import { FeedPagination } from '../../components/feed-pagination/feed-pagination';
import { FeaturedExercises } from '../../components/featured-exercises/featured-exercises';
import { PostComposer } from '../../components/post-composer/post-composer';
import { PostList } from '../../components/post-list/post-list';
import { SidebarNav } from '../../../../shared/components/sidebar-nav/sidebar-nav';
import { CreatePostDraft, CreatePostRequest, Exercise, Post, WorkoutSession } from '../../../../shared/models';
import { ExercisesService } from '../../../../core/services/exercises.service';
import { PostsService } from '../../../../core/services/posts.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WorkoutSessionsService } from '../../../../core/services/workout-sessions.service';

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
  private readonly authService = inject(AuthService);
  private readonly exercisesService = inject(ExercisesService);
  private readonly postsService = inject(PostsService);
  private readonly toastService = inject(ToastService);
  private readonly workoutSessionsService = inject(WorkoutSessionsService);

  readonly exercises = signal<Exercise[]>([]);
  readonly posts = signal<Post[]>([]);
  readonly workoutSessions = signal<WorkoutSession[]>([]);
  readonly isLoading = signal(true);
  readonly isPublishing = signal(false);
  readonly isLoadingWorkoutSessions = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly publishErrorMessage = signal<string | null>(null);
  readonly exercisesErrorMessage = signal<string | null>(null);
  readonly currentUser = this.authService.currentUser;

  // Paginacion
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly pageSize = 10;

  ngOnInit(): void {
    this.loadExercises();
    this.loadWorkoutSessions();
    this.loadFeed();
  }

  loadWorkoutSessions(): void {
    const user = this.currentUser();

    if (!user) {
      return;
    }

    this.isLoadingWorkoutSessions.set(true);

    this.workoutSessionsService.findByUserId(user.id).subscribe({
      next: (sessions) => {
        this.workoutSessions.set(sessions);
        this.isLoadingWorkoutSessions.set(false);
      },
      error: () => {
        this.workoutSessions.set([]);
        this.isLoadingWorkoutSessions.set(false);
        this.toastService.showError('No pudimos cargar tus entrenamientos para publicar.', 'Entrenamientos no disponibles');
      }
    });
  }

  loadExercises(): void {
    this.exercisesErrorMessage.set(null);

    this.exercisesService.findAll().subscribe({
      next: (exercises) => {
        this.exercises.set(exercises.slice(0, 3));
      },
      error: () => {
        const message = 'No pudimos cargar ejercicios destacados.';

        this.exercisesErrorMessage.set(message);
        this.toastService.showError(message, 'Ejercicios no disponibles');
      }
    });
  }

  loadFeed(page = this.currentPage()): void {
    const requestedPage = Math.max(page, 1);

    this.isLoading.set(true);
    this.currentPage.set(requestedPage);
    this.errorMessage.set(null);

    this.postsService.findPage(requestedPage, this.pageSize).subscribe({
      next: (feed) => {
        this.posts.set(feed.items);
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

  publishPost(request: CreatePostDraft): void {
    if (this.isPublishing()) {
      return;
    }

    const user = this.currentUser();

    if (!user) {
      const message = 'Necesitás iniciar sesión para publicar.';

      this.publishErrorMessage.set(message);
      this.toastService.showError(message, 'Sesión requerida');
      return;
    }

    this.isPublishing.set(true);
    this.publishErrorMessage.set(null);

    const createRequest: CreatePostRequest = {
      ...request,
      userId: user.id
    };

    this.postsService.createPost(createRequest).subscribe({
      next: (createdPost) => {
        const nextTotalElements = this.totalElements() + 1;

        this.posts.update((currentPosts) => [createdPost, ...currentPosts].slice(0, this.pageSize));
        this.totalElements.set(nextTotalElements);
        this.totalPages.set(Math.ceil(nextTotalElements / this.pageSize));
        this.currentPage.set(1);
        this.isPublishing.set(false);
        this.toastService.show({ type: 'success', title: 'Post publicado', message: 'Tu publicación ya aparece arriba del feed.' });
      },
      error: () => {
        const message = 'No pudimos publicar el post. Revisá los datos e intentá nuevamente.';

        this.publishErrorMessage.set(message);
        this.toastService.showError(message, 'Publicación no creada');
        this.isPublishing.set(false);
      }
    });
  }

}
