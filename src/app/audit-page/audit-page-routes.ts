import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { AuditPageResolver } from './audit-page.resolver';
import { AuditDetailComponent } from './detail/audit-detail.component';
import { ObjectAuditOverviewComponent } from './object-audit-overview/object-audit-overview.component';
import { AuditOverviewComponent } from './overview/audit-overview.component';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { breadcrumbKey: 'audit.overview' },
    canActivate: [authenticatedGuard],
    providers: [AuditPageResolver],
    children: [
      {
        path: '',
        component: AuditOverviewComponent,
        data: { title: 'audit.overview.title' },
      },
      {
        path: ':id',
        component: AuditDetailComponent,
        resolve: {
          process: AuditPageResolver,
          // TODO: breadcrumbs resolver
        },
      },
      {
        path: 'object/:objectId',
        component: ObjectAuditOverviewComponent,
        // TODO: breadcrumbs resolver
      },
    ],
  },

];
