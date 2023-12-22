import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../../core/breadcrumbs/i18n-breadcrumbs.service';
import { AuthenticatedGuard } from "../../core/auth/authenticated.guard";
import { AdminNotifyDashboardComponent } from "./admin-notify-dashboard.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [ AuthenticatedGuard ],
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
        }
      },
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
