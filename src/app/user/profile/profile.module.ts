import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { CuponesComponent } from './cupones/cupones.component'
import { ImagenesComponent } from './imagenes/imagenes.component'

// import { SharedModule } from '../../shared/modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ProfilePage,
    ImagenesComponent,
    CuponesComponent
  ]
})
export class ProfilePageModule { }
