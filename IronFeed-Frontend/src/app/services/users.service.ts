import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AppUser } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${environment.apiGatewayUrl}/api/users`;

  findAll(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.usersUrl);
  }
}
