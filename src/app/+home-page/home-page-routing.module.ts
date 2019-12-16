import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { HomePageResolver } from './home-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomePageComponent,
        pathMatch: 'full',
        data: {title: 'home.title'},
        resolve: {
          site: HomePageResolver
        }
      }
    ])
  ],
  providers: [
    HomePageResolver
  ]
})
export class HomePageRoutingModule {
}
