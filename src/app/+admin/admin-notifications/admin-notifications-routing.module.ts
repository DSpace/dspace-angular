import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../../core/breadcrumbs/i18n-breadcrumbs.service';
import { NOTIFICATIONS_EDIT_PATH, NOTIFICATIONS_RECITER_SUGGESTION_PATH } from './admin-notifications-routing-paths';
import { AdminNotificationsOpenairebrokerPageComponent } from './admin-notifications-openairebroker-page/admin-notifications-openairebroker-page.component';
import { AdminNotificationsOpenaireeventPageComponent } from './admin-notifications-openaireevent-page/admin-notifications-openaireevent-page.component';
import { AdminNotificationsOpenaireBrokerPageResolver } from './admin-notifications-openairebroker-page/admin-notifications-openairebroker-page.resolver';
import { AdminNotificationsOpenaireEventPageResolver } from './admin-notifications-openaireevent-page/admin-notifications-openaireevent-page.resolver';
import { AdminNotificationsReciterPageComponent } from './admin-notifications-reciter-page/admin-notifications-reciter-page.component';
import { AdminNotificationsReciterPageResolver } from './admin-notifications-reciter-page/admin-notifications-reciter-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${NOTIFICATIONS_EDIT_PATH}`,
        component: AdminNotificationsOpenairebrokerPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireBrokerTopicsParams: AdminNotificationsOpenaireBrokerPageResolver
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
        component: AdminNotificationsOpenaireeventPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireBrokerTopicsParams: AdminNotificationsOpenaireEventPageResolver
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
        component: AdminNotificationsReciterPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          reciterSuggestionTargetParams: AdminNotificationsReciterPageResolver
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
    AdminNotificationsOpenaireBrokerPageResolver,
    AdminNotificationsOpenaireEventPageResolver,
    AdminNotificationsReciterPageResolver
  ]
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotificationsRoutingModule {

}
