import { Route } from '@angular/router';
import { i18nBreadcrumbResolver, siteAdministratorGuard } from '@dspace/core'

import { HealthPageComponent } from './health-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: {
      breadcrumbKey: 'health',
      title: 'health-page.title',
    },
    canActivate: [siteAdministratorGuard],
    component: HealthPageComponent,
  },
];

