import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/feed/pages/feed-page/feed-page').then((page) => page.FeedPage)
  }
];
