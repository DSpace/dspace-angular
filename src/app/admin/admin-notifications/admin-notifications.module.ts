import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminNotificationsRoutingModule } from './admin-notifications-routing.module';
import { AdminNotificationsBrokerTopicsPageComponent } from './admin-notifications-broker-topics-page/admin-notifications-broker-topics-page.component';
import { AdminNotificationsBrokerEventsPageComponent } from './admin-notifications-broker-events-page/admin-notifications-broker-events-page.component';
import { NotificationsModule } from '../../notifications/notifications.module';
import { AdminNotificationsBrokerSourcePageComponent } from './admin-notifications-broker-source-page-component/admin-notifications-broker-source-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    AdminNotificationsRoutingModule,
    NotificationsModule
  ],
  declarations: [
    AdminNotificationsBrokerTopicsPageComponent,
    AdminNotificationsBrokerEventsPageComponent,
    AdminNotificationsBrokerSourcePageComponent
  ],
  entryComponents: []
})
/**
 * This module handles all components related to the notifications pages
 */
export class AdminNotificationsModule {

}
