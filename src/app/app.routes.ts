import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/ads/pages/product-list/product-list').then(c => c.ProductListComponent)
  },
  {
    path: 'ads/:id', 
    loadComponent: () => import('./features/ads/product/product.component').then(c => c.ProductComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile-page/profile-page').then(c => c.ProfilePageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'new-ad',
    loadComponent: () => import('./features/ads/new-ad/new-ad.component').then(c => c.NewAdComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(c => c.LoginComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent), 
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];