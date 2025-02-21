import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '@dspace/core';
import { ThemedProfilePageComponent } from './themed-profile-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedProfilePageComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { breadcrumbKey: 'profile', title: 'profile.title' },
  },
];
