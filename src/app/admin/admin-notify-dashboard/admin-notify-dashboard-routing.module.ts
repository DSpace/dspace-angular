import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import {
  SiteAdministratorGuard
} from '../../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import {
  AdminNotifyIncomingComponent
} from './admin-notify-logs/admin-notify-incoming/admin-notify-incoming.component';
import {
  AdminNotifyOutgoingComponent
} from './admin-notify-logs/admin-notify-outgoing/admin-notify-outgoing.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [SiteAdministratorGuard],
        path: '',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
        },
        component: AdminNotifyDashboardComponent,
        pathMatch: 'full',
        data: {
          title: 'admin.notify.dashboard.page.title',
          breadcrumbKey: 'admin.notify.dashboard',
        },
      },
      {
        path: 'inbound',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
        },
        component: AdminNotifyIncomingComponent,
        canActivate: [SiteAdministratorGuard],
        data: {
          title: 'admin.notify.dashboard.page.title',
          breadcrumbKey: 'admin.notify.dashboard',
        },
      },
      {
        path: 'outbound',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
        },
        component: AdminNotifyOutgoingComponent,
        canActivate: [SiteAdministratorGuard],
        data: {
          title: 'admin.notify.dashboard.page.title',
          breadcrumbKey: 'admin.notify.dashboard',
        },
      }
    ])
  ],
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotifyDashboardRoutingModule {

}
