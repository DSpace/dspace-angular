import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '@dspace/core';
import { myDSpaceGuard } from './my-dspace.guard';
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedMyDSpacePageComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { title: 'mydspace.title', breadcrumbKey: 'mydspace' },
    canActivate: [
      myDSpaceGuard,
    ],
  },
];
