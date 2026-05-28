import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login-page/login-page').then((page) => page.LoginPage)
  },
  {
    path: '',
    loadComponent: () => import('./features/feed/pages/feed-page/feed-page').then((page) => page.FeedPage)
  }
];
