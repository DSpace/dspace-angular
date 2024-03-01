import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationsPageRoutingModule } from './notifications-pages-routing.module';
import { NotificationsSuggestionTargetsPageComponent } from './notifications-suggestion-targets-page/notifications-suggestion-targets-page.component';
import { QualityAssuranceTopicsPageComponent } from './quality-assurance-topics-page/quality-assurance-topics-page.component';
import { QualityAssuranceEventsPageComponent } from './quality-assurance-events-page/quality-assurance-events-page.component';
import { QualityAssuranceSourcePageComponent } from './quality-assurance-source-page-component/quality-assurance-source-page.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    NotificationsPageRoutingModule,
    NotificationsModule
  ],
  declarations: [
    NotificationsSuggestionTargetsPageComponent,
    QualityAssuranceTopicsPageComponent,
    QualityAssuranceEventsPageComponent,
    QualityAssuranceSourcePageComponent
  ],
  entryComponents: []
})
/**
 * This module handles all components related to the notifications pages
 */
export class NotificationsPageModule {

}
