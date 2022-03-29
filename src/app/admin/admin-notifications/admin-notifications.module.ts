import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminNotificationsRoutingModule } from './admin-notifications-routing.module';
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
    AdminNotificationsSuggestionTargetsPageComponent
  ],
  entryComponents: []
})
/**
 * This module handles all components related to the notifications pages
 */
export class AdminNotificationsModule {

}
