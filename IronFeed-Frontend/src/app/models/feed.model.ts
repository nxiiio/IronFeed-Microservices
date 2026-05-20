import { Post } from './post.model';

export interface FeedResponse {
  items: Post[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
