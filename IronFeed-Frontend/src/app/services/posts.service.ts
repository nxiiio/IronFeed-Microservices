import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Post } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly postsUrl = `${environment.apiGatewayUrl}/api/posts`;

  findAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }
}
