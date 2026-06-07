import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PersonalRecord } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PersonalRecordsService {
  private readonly http = inject(HttpClient);
  private readonly personalRecordsUrl = `${environment.apiGatewayUrl}/api/personal-records`;

  findById(id: string): Observable<PersonalRecord> {
    return this.http.get<PersonalRecord>(`${this.personalRecordsUrl}/${id}`);
  }
}
