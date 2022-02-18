import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../../core/breadcrumbs/i18n-breadcrumbs.service';
import { NOTIFICATIONS_EDIT_PATH } from './admin-notifications-routing-paths';
import { AdminNotificationsBrokerTopicsPageComponent } from './admin-notifications-broker-topics-page/admin-notifications-broker-topics-page.component';
import { AdminNotificationsBrokerEventsPageComponent } from './admin-notifications-broker-events-page/admin-notifications-broker-events-page.component';
import { AdminNotificationsBrokerTopicsPageResolver } from './admin-notifications-broker-topics-page/admin-notifications-broker-topics-page-resolver.service';
import { AdminNotificationsBrokerEventsPageResolver } from './admin-notifications-broker-events-page/admin-notifications-broker-events-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${NOTIFICATIONS_EDIT_PATH}`,
        component: AdminNotificationsBrokerTopicsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireBrokerTopicsParams: AdminNotificationsBrokerTopicsPageResolver
        },
        data: {
          title: 'admin.notifications.broker.page.title',
          breadcrumbKey: 'admin.notifications.broker',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${NOTIFICATIONS_EDIT_PATH}/:id`,
        component: AdminNotificationsBrokerEventsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireBrokerEventsParams: AdminNotificationsBrokerEventsPageResolver
        },
        data: {
          title: 'admin.notifications.event.page.title',
          breadcrumbKey: 'admin.notifications.event',
          showBreadcrumbsFluid: false
        }
      }
    ])
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService,
    AdminNotificationsBrokerTopicsPageResolver,
    AdminNotificationsBrokerEventsPageResolver
  ]
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotificationsRoutingModule {

}
