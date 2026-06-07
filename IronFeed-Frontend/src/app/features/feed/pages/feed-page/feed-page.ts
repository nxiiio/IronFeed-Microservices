import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { FeedHeader } from '../../components/feed-header/feed-header';
import { FeedLoadingSkeleton } from '../../components/feed-loading-skeleton/feed-loading-skeleton';
import { FeedPagination } from '../../components/feed-pagination/feed-pagination';
import { FeaturedExercises } from '../../components/featured-exercises/featured-exercises';
import { PostComposer } from '../../components/post-composer/post-composer';
import { PostList } from '../../components/post-list/post-list';
import { SidebarNav } from '../../../../shared/components/sidebar-nav/sidebar-nav';
import { Exercise, Post } from '../../../../shared/models';
import { ExercisesService } from '../../../../core/services/exercises.service';
import { PostsService } from '../../../../core/services/posts.service';
import { ToastService } from '../../../../core/services/toast.service';

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

  readonly exercises = signal<Exercise[]>([]);
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly exercisesErrorMessage = signal<string | null>(null);

  // Paginacion
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly pageSize = 10;

  ngOnInit(): void {
    this.loadExercises();
    this.loadFeed();
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

}
