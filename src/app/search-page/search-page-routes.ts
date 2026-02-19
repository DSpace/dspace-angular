import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedSearchPageComponent } from './themed-search-page.component';

export const ROUTES: Route[] = [{
  path: '',
  resolve: { breadcrumb: i18nBreadcrumbResolver }, data: { title: 'search.title', breadcrumbKey: 'search' },
  children: [
    { path: '', component: ThemedSearchPageComponent },
  ],
}];
