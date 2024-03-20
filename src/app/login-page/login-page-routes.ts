import { Route } from '@angular/router';

import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedLoginPageComponent } from './themed-login-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedLoginPageComponent,
    resolve: { breadcrumb: I18nBreadcrumbResolver },
    data: { breadcrumbKey: 'login', title: 'login.title' },
  },
];

