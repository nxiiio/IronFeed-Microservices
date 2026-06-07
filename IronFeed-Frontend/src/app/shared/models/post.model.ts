import { AppUser } from './app-user.model';

export type PostType = 'WORKOUT' | 'PERSONAL_RECORD' | 'PROGRESS_PHOTO';
export type PostAuthor = Pick<AppUser, 'id' | 'username' | 'name' | 'lastname' | 'bio'>;

export interface Post {
  id: string;
  authorId: string;
  author: PostAuthor | null;
  type: PostType;
  workoutSessionId: string | null;
  personalRecordId: string | null;
  caption: string | null;
  imageUrl: string | null;
  createdAt: string;
  reactionCount: number;
  commentCount: number;
}
