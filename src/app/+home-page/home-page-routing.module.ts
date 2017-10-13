import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomePageComponent } from './home-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomePageComponent, pathMatch: 'full', data: { title: 'home.title' } }
    ])
  ]
})
export class HomePageRoutingModule { }
