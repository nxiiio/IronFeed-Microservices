import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/login-page/login-page').then((page) => page.LoginPage)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/feed/pages/feed-page/feed-page').then((page) => page.FeedPage)
  }
];
