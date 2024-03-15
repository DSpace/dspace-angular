import { Route } from '@angular/router';

import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedProfilePageComponent } from './themed-profile-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedProfilePageComponent,
    resolve: { breadcrumb: I18nBreadcrumbResolver },
    data: { breadcrumbKey: 'profile', title: 'profile.title' },
  },
];
