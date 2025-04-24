import { Route } from '@angular/router';

import { homePageResolver } from './home-page.resolver';
import { ThemedHomePageComponent } from './themed-home-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedHomePageComponent,
    pathMatch: 'full',
    data: {
      title: 'home.title',
      showSocialButtons: true,
    },
    resolve: {
      site: homePageResolver,
    },
  },
];
