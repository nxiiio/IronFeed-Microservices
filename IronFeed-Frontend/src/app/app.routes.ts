import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/login-page/login-page').then((page) => page.LoginPage)
  },
  {
    path: 'posts/:postId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/post-detail/pages/post-detail-page/post-detail-page').then((page) => page.PostDetailPage)
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => import('./features/feed/pages/feed-page/feed-page').then((page) => page.FeedPage)
  }
];
