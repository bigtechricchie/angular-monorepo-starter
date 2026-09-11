import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'health',
  },
  {
    path: 'health',
    loadComponent: () =>
      import('./pages/health/health').then(
        (module) => module.Health,
      ),
  },
];
