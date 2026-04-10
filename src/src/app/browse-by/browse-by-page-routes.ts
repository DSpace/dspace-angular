import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { browseByDSOBreadcrumbResolver } from './browse-by-dso-breadcrumb.resolver';
import { BrowseByGeospatialDataComponent } from './browse-by-geospatial-data/browse-by-geospatial-data.component';
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
        path: 'map',
        component: BrowseByGeospatialDataComponent,
        resolve: { breadcrumb: i18nBreadcrumbResolver },
        data: { title: 'browse.map.page', breadcrumbKey: 'browse.metadata.map' },
      },
      {
        path: ':id',
        component: BrowseByPageComponent,
        canActivate: [browseByGuard],
        resolve: { breadcrumb: browseByI18nBreadcrumbResolver },
        data: { title: 'browse.title.page', breadcrumbKey: 'browse.metadata' },
      },
    ],
  }];
