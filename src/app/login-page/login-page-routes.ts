import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../../../modules/core/src/lib/core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedLoginPageComponent } from './themed-login-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedLoginPageComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { breadcrumbKey: 'login', title: 'login.title' },
  },
];

