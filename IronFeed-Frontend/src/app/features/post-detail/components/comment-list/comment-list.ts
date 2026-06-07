import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AppUser, PostComment } from '../../../../shared/models';
import { CommentCard } from '../comment-card/comment-card';

@Component({
  selector: 'app-comment-list',
  imports: [CommentCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comment-list.html'
})
export class CommentList {
  comments = input.required<PostComment[]>();
  authors = input.required<AppUser[]>();
  commentsErrorMessage = input<string | null>(null);
  authorsErrorMessage = input<string | null>(null);

  readonly authorsById = computed(() =>
    new Map(this.authors().map((author) => [author.id, author]))
  );

  findAuthor(comment: PostComment): AppUser | null {
    return this.authorsById().get(comment.authorId) ?? null;
  }
}
