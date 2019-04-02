import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'user-home', loadChildren: './user/home/home.module#HomePageModule' },
  { path: 'user-coupon', loadChildren: './user/coupon/coupon.module#CouponPageModule' },
  { path: 'admin-home', loadChildren: './admin/home/home.module#HomePageModule' },
  { path: 'admin-coupon', loadChildren: './admin/coupon/coupon.module#CouponPageModule' },
  { path: 'user-profile', loadChildren: './user/profile/profile.module#ProfilePageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'camera', loadChildren: './user/camera/camera.module#CameraPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
