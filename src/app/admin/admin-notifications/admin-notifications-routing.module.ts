import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../../core/breadcrumbs/i18n-breadcrumbs.service';
import { NOTIFICATIONS_EDIT_PATH, NOTIFICATIONS_RECITER_SUGGESTION_PATH } from './admin-notifications-routing-paths';
import { AdminNotificationsSuggestionTargetsPageComponent } from './admin-notifications-suggestion-targets-page/admin-notifications-suggestion-targets-page.component';
import { AdminNotificationsSuggestionTargetsPageResolver } from './admin-notifications-suggestion-targets-page/admin-notifications-suggestion-targets-page-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
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
    AdminNotificationsSuggestionTargetsPageResolver
  ]
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotificationsRoutingModule {

}
