import { Post } from './post.model';

export interface Feed {
  items: Post[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
