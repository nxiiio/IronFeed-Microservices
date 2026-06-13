import { AppUser } from './app-user.model';

export type PostType = 'WORKOUT' | 'PERSONAL_RECORD' | 'PROGRESS_PHOTO';
export type CreatePostType = Exclude<PostType, 'PERSONAL_RECORD'>;
export type PostAuthor = Pick<AppUser, 'id' | 'username' | 'name' | 'lastname' | 'bio'>;

export interface CreatePostRequest {
  userId: string;
  type: CreatePostType;
  caption: string;
  workoutSessionId?: string;
}

export type CreatePostDraft = Omit<CreatePostRequest, 'userId'>;

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
