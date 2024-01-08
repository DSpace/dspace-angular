import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../../core/breadcrumbs/i18n-breadcrumbs.service';
import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import {
  SiteAdministratorGuard
} from '../../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import {
  AdminNotifyIncomingComponent
} from "./admin-notify-logs/admin-notify-incoming/admin-notify-incoming.component";
import {
  AdminNotifyOutgoingComponent
} from "./admin-notify-logs/admin-notify-outgoing/admin-notify-outgoing.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [SiteAdministratorGuard],
        path: '',
        component: AdminNotifyDashboardComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
        },
        data: {
          title: 'admin.notify.dashboard.page.title',
          breadcrumbKey: 'admin.notify.dashboard',
          showBreadcrumbsFluid: false
        },
      },
      {
        path: 'inbound',
        component: AdminNotifyIncomingComponent,
        canActivate: [SiteAdministratorGuard],
      },
      {
        path: 'outbound',
        component: AdminNotifyOutgoingComponent,
        canActivate: [SiteAdministratorGuard],
      }
    ])
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService,
  ]
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotifyDashboardRoutingModule {

}
