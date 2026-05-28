import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { AuthSession } from './auth-session.model';

const AUTH_SESSION_KEY = 'ironfeed.auth.session';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readSession(): AuthSession | null {
    if (!this.isBrowser) {
      return null;
    }

    return this.readSessionFromStorage(localStorage) ?? this.readSessionFromStorage(sessionStorage);
  }

  saveSession(session: AuthSession, rememberSession: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    this.clearSession();
    this.getStorage(rememberSession).setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  }

  clearSession(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }

  private readSessionFromStorage(storage: Storage): AuthSession | null {
    const rawSession = storage.getItem(AUTH_SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      storage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
  }

  private getStorage(rememberSession: boolean): Storage {
    return rememberSession ? localStorage : sessionStorage;
  }
}
