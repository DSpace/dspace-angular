import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core/core.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminNotificationsPublicationClaimPageComponent } from './admin-notifications-publication-claim-page/admin-notifications-publication-claim-page.component';
import { AdminNotificationsRoutingModule } from './admin-notifications-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    AdminNotificationsRoutingModule,
    NotificationsModule,
  ],
  declarations: [
    AdminNotificationsPublicationClaimPageComponent,
  ],
  entryComponents: [],
})
/**
 * This module handles all components related to the notifications pages
 */
export class AdminNotificationsModule {

}
