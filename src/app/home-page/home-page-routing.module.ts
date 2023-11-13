import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomePageResolver } from './home-page.resolver';
import { ThemedHomePageComponent } from './themed-home-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedHomePageComponent,
        pathMatch: 'full',
        data: {
          title: 'home.title',
          menu: {
            public: [],
          }, showSocialButtons: true
        },
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
