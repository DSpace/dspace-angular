import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../../core/breadcrumbs/i18n-breadcrumbs.service';
import { NOTIFICATIONS_EDIT_PATH, NOTIFICATIONS_RECITER_SUGGESTION_PATH } from './admin-notifications-routing-paths';
import { AdminNotificationsOpenaireTopicsPageComponent } from './admin-notifications-openaire-topics-page/admin-notifications-openaire-topics-page.component';
import { AdminNotificationsOpenaireEventsPageComponent } from './admin-notifications-openaire-events-page/admin-notifications-openaire-events-page.component';
import { AdminNotificationsOpenaireTopicsPageResolver } from './admin-notifications-openaire-topics-page/admin-notifications-openaire-topics-page-resolver.service';
import { AdminNotificationsOpenaireEventsPageResolver } from './admin-notifications-openaire-events-page/admin-notifications-openaire-events-page.resolver';
import { AdminNotificationsSuggestionTargetsPageComponent } from './admin-notifications-suggestion-targets-page/admin-notifications-suggestion-targets-page.component';
import { AdminNotificationsSuggestionTargetsPageResolver } from './admin-notifications-suggestion-targets-page/admin-notifications-suggestion-targets-page-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${NOTIFICATIONS_EDIT_PATH}`,
        component: AdminNotificationsOpenaireTopicsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireBrokerTopicsParams: AdminNotificationsOpenaireTopicsPageResolver
        },
        data: {
          title: 'admin.notifications.openairebroker.page.title',
          breadcrumbKey: 'admin.notifications.openairebroker',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${NOTIFICATIONS_EDIT_PATH}/:id`,
        component: AdminNotificationsOpenaireEventsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireBrokerEventsParams: AdminNotificationsOpenaireEventsPageResolver
        },
        data: {
          title: 'admin.notifications.openaireevent.page.title',
          breadcrumbKey: 'admin.notifications.openaireevent',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${NOTIFICATIONS_RECITER_SUGGESTION_PATH}`,
        component: AdminNotificationsSuggestionTargetsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          reciterSuggestionTargetParams: AdminNotificationsSuggestionTargetsPageResolver
        },
        data: {
          title: 'admin.notifications.recitersuggestion.page.title',
          breadcrumbKey: 'admin.notifications.recitersuggestion',
          showBreadcrumbsFluid: false
        }
      },
    ])
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService,
    AdminNotificationsOpenaireTopicsPageResolver,
    AdminNotificationsOpenaireEventsPageResolver,
    AdminNotificationsSuggestionTargetsPageResolver
  ]
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotificationsRoutingModule {

}
