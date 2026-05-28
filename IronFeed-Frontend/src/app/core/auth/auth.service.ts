import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthSession, LoginRequest, LoginResponse } from './auth-session.model';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStorage = inject(AuthStorageService);
  private readonly authUrl = `${environment.apiGatewayUrl}/api/auth`;
  private readonly sessionState = signal<AuthSession | null>(this.authStorage.readSession());

  readonly currentUser = computed(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionState() !== null);

  login(credentials: LoginRequest, rememberSession: boolean): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/login`, credentials)
      .pipe(tap((response) => this.saveSession(response, rememberSession)));
  }

  logout(): void {
    this.sessionState.set(null);
    this.authStorage.clearSession();
  }

  getAccessToken(): string | null {
    return this.sessionState()?.accessToken ?? null;
  }

  hasSession(): boolean {
    return this.sessionState() !== null;
  }

  private saveSession(response: LoginResponse, rememberSession: boolean): void {
    const session: AuthSession = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      expiresIn: response.expiresIn,
      user: response.user
    };

    this.sessionState.set(session);
    this.authStorage.saveSession(session, rememberSession);
  }
}
