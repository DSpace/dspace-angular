import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminNotificationsRoutingModule } from './admin-notifications-routing.module';
import { AdminQualityAssuranceTopicsPageComponent } from './admin-quality-assurance-topics-page/admin-quality-assurance-topics-page.component';
import { AdminQualityAssuranceEventsPageComponent } from './admin-quality-assurance-events-page/admin-quality-assurance-events-page.component';
import { AdminQualityAssuranceSourcePageComponent } from './admin-quality-assurance-source-page-component/admin-quality-assurance-source-page.component';
import {NotificationsModule} from '../../notifications/notifications.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    AdminNotificationsRoutingModule,
    NotificationsModule
  ],
  declarations: [
    AdminQualityAssuranceTopicsPageComponent,
    AdminQualityAssuranceEventsPageComponent,
    AdminQualityAssuranceSourcePageComponent
  ],
  entryComponents: []
})
/**
 * This module handles all components related to the notifications pages
 */
export class AdminNotificationsModule {

}
