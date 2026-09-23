import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((module) => module.Home),
  },
  {
    path: 'health',
    loadComponent: () =>
      import('./pages/health/health').then((module) => module.Health),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then(
        (module) => module.NotFound,
      ),
  },
];
