import { Route } from '@angular/router';

import { browseByDSOBreadcrumbResolver } from './browse-by-dso-breadcrumb.resolver';
import { browseByGuard } from './browse-by-guard';
import { browseByI18nBreadcrumbResolver } from './browse-by-i18n-breadcrumb.resolver';
import { BrowseByPageComponent } from './browse-by-page/browse-by-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: {
      breadcrumb: browseByDSOBreadcrumbResolver,
    },
    children: [
      {
        path: ':id',
        component: BrowseByPageComponent,
        canActivate: [browseByGuard],
        resolve: { breadcrumb: browseByI18nBreadcrumbResolver },
        data: { title: 'browse.title.page', breadcrumbKey: 'browse.metadata' },
      },
    ],
  }];
