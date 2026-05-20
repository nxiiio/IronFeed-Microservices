import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { FeedResponse, Post } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly feedUrl = `${environment.apiGatewayUrl}/api/feed`;

  findPage(page = 1, size = 20): Observable<FeedResponse> {
    return this.http.get<FeedResponse>(this.feedUrl, {
      params: {
        page: String(page),
        size: String(size)
      }
    });
  }

  findAll(): Observable<Post[]> {
    return this.findPage().pipe(
      map((response) => response.items)
    );
  }
}
