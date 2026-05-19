import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AppUser, Post } from '../../models';
import { PostCard } from '../post-card/post-card';

@Component({
  selector: 'app-post-list',
  imports: [PostCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-list.html',
  styleUrl: './post-list.css'
})
export class PostList {
  posts = input.required<Post[]>();
  authors = input<AppUser[]>([]);

  findAuthor(authorId: string): AppUser | null {
    return this.authors().find((author) => author.id === authorId) ?? null;
  }
}
