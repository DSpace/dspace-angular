import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { AuditOverviewComponent } from './overview/audit-overview.component';

export const ROUTES: Route[] = [
  {
    path: '',
    canActivate: [authenticatedGuard],
    children: [
      {
        path: '',
        component: AuditOverviewComponent,
        data: { title: 'audit.overview.title', breadcrumbKey: 'audit.overview' },
        resolve: { breadcrumb: i18nBreadcrumbResolver },
      },
    ],
  },

];
