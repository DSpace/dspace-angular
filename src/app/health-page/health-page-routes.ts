import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../../../modules/core/src/lib/core/breadcrumbs/i18n-breadcrumb.resolver';
import { siteAdministratorGuard } from '../../../modules/core/src/lib/core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
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

