export type PostType = 'WORKOUT' | 'PERSONAL_RECORD' | 'PROGRESS_PHOTO';

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  workoutSessionId: string | null;
  personalRecordId: string | null;
  caption: string | null;
  imageUrl: string | null;
  createdAt: string;
  reactionCount: number;
  commentCount: number;
}
