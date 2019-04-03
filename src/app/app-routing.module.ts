import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // SHARED PAGES
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },

  // ADMIN PAGES
  { path: 'admin-home', loadChildren: './admin/home/home.module#HomePageModule' },
  { path: 'admin-coupon', loadChildren: './admin/coupon/coupon.module#CouponPageModule' },
  { path: 'admin-images', loadChildren: './admin/images/images.module#ImagesPageModule' },

  // USER PAGES
  { path: 'user-home', loadChildren: './user/home/home.module#HomePageModule' },
  { path: 'user-coupon', loadChildren: './user/coupon/coupon.module#CouponPageModule' },
  { path: 'user-profile', loadChildren: './user/profile/profile.module#ProfilePageModule' },
  { path: 'user-camera', loadChildren: './user/camera/camera.module#CameraPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
