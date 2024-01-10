import { Route } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { ThemedLoginPageComponent } from './themed-login-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    providers: [
      I18nBreadcrumbResolver,
      I18nBreadcrumbsService
    ],
    component: ThemedLoginPageComponent,
    resolve: {breadcrumb: I18nBreadcrumbResolver},
    data: {breadcrumbKey: 'login', title: 'login.title'}
  }
];

