import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Exercise } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  private readonly http = inject(HttpClient);
  private readonly exercisesUrl = `${environment.apiGatewayUrl}/api/exercises`;

  findAll(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.exercisesUrl);
  }
}
