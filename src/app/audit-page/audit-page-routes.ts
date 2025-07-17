import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { auditPageResolver } from './audit-page.resolver';
import { AuditDetailComponent } from './detail/audit-detail.component';
import { ObjectAuditOverviewComponent } from './object-audit-overview/object-audit-overview.component';
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
      {
        path: ':id',
        component: AuditDetailComponent,
        data: { title: 'audit.detail.title', breadcrumbKey: 'audit.detail' },
        resolve: {
          process: auditPageResolver,
          breadcrumb: i18nBreadcrumbResolver,
        },
      },
      {
        path: 'object/:objectId',
        component: ObjectAuditOverviewComponent,
        data: { title: 'audit.object.title', breadcrumbKey: 'audit.object' },
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
      },
    ],
  },

];
