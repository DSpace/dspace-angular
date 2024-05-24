import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { AuditPageResolver } from './audit-page.resolver';
import { AuditDetailComponent } from './detail/audit-detail.component';
import { ObjectAuditOverviewComponent } from './object-audit-overview/object-audit-overview.component';
import { AuditOverviewComponent } from './overview/audit-overview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { breadcrumbKey: 'audit.overview' },
        canActivate: [AuthenticatedGuard],
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

    ]),
  ],
  providers: [
    AuditPageResolver,
  ],
})
export class AuditPageRoutingModule {

}
