import { Route } from '@angular/router';

import { DSOEditMenuResolver } from '../shared/dso-page/dso-edit-menu.resolver';
import { BrowseByDSOBreadcrumbResolver } from './browse-by-dso-breadcrumb.resolver';
import { BrowseByGuard } from './browse-by-guard';
import { BrowseByI18nBreadcrumbResolver } from './browse-by-i18n-breadcrumb.resolver';
import { BrowseByPageComponent } from './browse-by-page/browse-by-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: {
      breadcrumb: BrowseByDSOBreadcrumbResolver,
      menu: DSOEditMenuResolver,
    },
    children: [
      {
        path: ':id',
        component: BrowseByPageComponent,
        canActivate: [BrowseByGuard],
        resolve: { breadcrumb: BrowseByI18nBreadcrumbResolver },
        data: { title: 'browse.title.page', breadcrumbKey: 'browse.metadata' },
      },
    ],
  }];
