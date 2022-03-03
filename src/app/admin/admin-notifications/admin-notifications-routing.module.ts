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
import { AdminNotificationsBrokerSourcePageComponent } from './admin-notifications-broker-source-page-component/admin-notifications-broker-source-page.component';
import { AdminNotificationsBrokerSourcePageResolver } from './admin-notifications-broker-source-page-component/admin-notifications-broker-source-page-resolver.service';
import { SourceDataResolver } from './admin-notifications-broker-source-page-component/admin-notifications-broker-source-data.reslover';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${NOTIFICATIONS_EDIT_PATH}/:sourceId`,
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
        path: `${NOTIFICATIONS_EDIT_PATH}`,
        component: AdminNotificationsBrokerSourcePageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireBrokerSourceParams: AdminNotificationsBrokerSourcePageResolver,
          sourceData: SourceDataResolver
        },
        data: {
          title: 'admin.notifications.source.breadcrumbs',
          breadcrumbKey: 'admin.notifications.source',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${NOTIFICATIONS_EDIT_PATH}/:sourceId/:topicId`,
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
    SourceDataResolver,
    AdminNotificationsBrokerTopicsPageResolver,
    AdminNotificationsBrokerEventsPageResolver,
    AdminNotificationsBrokerSourcePageResolver
  ]
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotificationsRoutingModule {

}
