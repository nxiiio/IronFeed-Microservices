import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';

import { FeaturedExercises } from '../../components/featured-exercises/featured-exercises';
import { PostComposer } from '../../components/post-composer/post-composer';
import { PostList } from '../../components/post-list/post-list';
import { SidebarNav } from '../../components/sidebar-nav/sidebar-nav';
import { AppUser, Exercise, Post } from '../../models';
import { ExercisesService } from '../../services/exercises.service';
import { PostsService } from '../../services/posts.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-feed-page',
  imports: [FeaturedExercises, PostComposer, PostList, SidebarNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feed-page.html',
  styleUrl: './feed-page.css'
})
export class FeedPage implements OnInit {
  private readonly exercisesService = inject(ExercisesService);
  private readonly postsService = inject(PostsService);
  private readonly usersService = inject(UsersService);

  readonly exercises = signal<Exercise[]>([]);
  readonly users = signal<AppUser[]>([]);
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly exercisesErrorMessage = signal<string | null>(null);
  readonly usersErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.exercisesErrorMessage.set(null);
    this.usersErrorMessage.set(null);

    forkJoin({
      exercises: this.exercisesService.findAll().pipe(
        catchError(() => {
          this.exercisesErrorMessage.set('No pudimos cargar ejercicios destacados.');
          return of([]);
        })
      ),
      posts: this.postsService.findAll(),
      users: this.usersService.findAll().pipe(
        catchError(() => {
          this.usersErrorMessage.set('No pudimos cargar los usuarios. Algunos posts pueden aparecer sin autor.');
          return of([]);
        })
      )
    }).subscribe({
      next: ({ exercises, posts, users }) => {
        this.exercises.set(exercises.slice(0, 3));
        this.posts.set(posts);
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.exercises.set([]);
        this.posts.set([]);
        this.users.set([]);
        this.errorMessage.set('No pudimos cargar los posts del feed.');
        this.isLoading.set(false);
      }
    });
  }
}
