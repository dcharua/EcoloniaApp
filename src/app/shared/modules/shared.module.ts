import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarComponent
  }
];

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    NavbarComponent
  ]
})
export class SharedModule { }
