import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateCommentRequest, Feed, Post, PostComment } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly postsPageUrl = `${environment.apiGatewayUrl}/api/posts`;

  findPage(page = 1, size = 20): Observable<Feed> {
    return this.http.get<Feed>(this.postsPageUrl, {
      params: {
        page: String(page),
        size: String(size)
      }
    });
  }

  findById(postId: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsPageUrl}/${postId}`);
  }

  findCommentsByPostId(postId: string): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.postsPageUrl}/${postId}/comments`);
  }

  createComment(postId: string, request: CreateCommentRequest): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.postsPageUrl}/${postId}/comments`, request);
  }

  findAll(): Observable<Post[]> {
    return this.findPage().pipe(
      map((response) => response.items)
    );
  }
}
