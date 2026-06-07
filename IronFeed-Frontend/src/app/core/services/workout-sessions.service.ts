import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { WorkoutSession } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class WorkoutSessionsService {
  private readonly http = inject(HttpClient);
  private readonly workoutSessionsUrl = `${environment.apiGatewayUrl}/api/workout-sessions`;

  findById(id: string): Observable<WorkoutSession> {
    return this.http.get<WorkoutSession>(`${this.workoutSessionsUrl}/${id}`);
  }
}
