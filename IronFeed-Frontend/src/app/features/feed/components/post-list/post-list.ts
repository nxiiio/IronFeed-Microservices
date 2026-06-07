import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Post } from '../../../../shared/models';
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
}
