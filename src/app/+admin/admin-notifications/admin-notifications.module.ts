import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminNotificationsRoutingModule } from './admin-notifications-routing.module';
import { AdminNotificationsOpenaireTopicsPageComponent } from './admin-notifications-openaire-topics-page/admin-notifications-openaire-topics-page.component';
import { AdminNotificationsOpenaireEventsPageComponent } from './admin-notifications-openaire-events-page/admin-notifications-openaire-events-page.component';
import { OpenaireModule } from '../../openaire/openaire.module';
import { AdminNotificationsSuggestionTargetsPageComponent } from './admin-notifications-suggestion-targets-page/admin-notifications-suggestion-targets-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    AdminNotificationsRoutingModule,
    OpenaireModule
  ],
  declarations: [
    AdminNotificationsOpenaireTopicsPageComponent,
    AdminNotificationsOpenaireEventsPageComponent,
    AdminNotificationsSuggestionTargetsPageComponent
  ],
  entryComponents: []
})
/**
 * This module handles all components related to the notifications pages
 */
export class AdminNotificationsModule {

}
