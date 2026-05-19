import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/feed/feed-page').then((page) => page.FeedPage)
  }
];
