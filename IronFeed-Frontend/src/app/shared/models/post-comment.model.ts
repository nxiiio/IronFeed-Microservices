export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  userId: string;
  content: string;
}
