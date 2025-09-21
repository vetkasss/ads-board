import { Routes } from '@angular/router';
import { ProductListComponent } from './features/ads/product-list/product-list';
import { ProfilePageComponent } from './features/profile/profile-page/profile-page';
import { ProductComponent } from './features/ads/product/product.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'ad/:id', component: ProductComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: '**', redirectTo: '' }
];