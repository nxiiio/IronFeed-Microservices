import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { AuthSession } from '../models/auth-session.model';

const AUTH_SESSION_KEY = 'ironfeed.auth.session';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readSession(): AuthSession | null {
    // si no es en el navegar, devuelve null (por ejemplo, en SSR)
    if (!this.isBrowser) {
      return null;
    }

    const persistentSession = this.readSessionFromStorage(localStorage);
    const temporarySession = this.readSessionFromStorage(sessionStorage);

    // persistentSession = local storage
    // temporarySession = session storage
    return persistentSession ?? temporarySession;
  }

  saveSession(session: AuthSession, usePersistentSession: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    this.clearSession();
    this.getSessionStorageTarget(usePersistentSession)
      .setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  }

  clearSession(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }

  private readSessionFromStorage(browserStorage: Storage): AuthSession | null {
    const rawSession = browserStorage.getItem(AUTH_SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as Partial<AuthSession>;

      if (!this.isValidSession(session)) {
        browserStorage.removeItem(AUTH_SESSION_KEY);
        return null;
      }

      return session;
    } catch {
      browserStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
  }

  private isValidSession(session: Partial<AuthSession>): session is AuthSession {
    return typeof session.accessToken === 'string' &&
      typeof session.tokenType === 'string' &&
      typeof session.expiresIn === 'number' &&
      typeof session.expiresAt === 'number' &&
      session.expiresAt > Date.now() &&
      session.user !== undefined;
  }

  private getSessionStorageTarget(usePersistentSession: boolean): Storage {
    const persistentSessionStorage = localStorage;
    const temporarySessionStorage = sessionStorage;

    return usePersistentSession ? persistentSessionStorage : temporarySessionStorage;
  }
}
