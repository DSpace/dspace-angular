import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  QualityAssuranceTopicsPageComponent
} from './quality-assurance-topics-page/quality-assurance-topics-page.component';
import {
  QualityAssuranceEventsPageComponent
} from './quality-assurance-events-page/quality-assurance-events-page.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { CoreModule } from '../core/core.module';


@NgModule({
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    NotificationsModule,
    QualityAssuranceEventsPageComponent,
    QualityAssuranceTopicsPageComponent
  ],
  entryComponents: []
})
/**
 * This module handles all components related to the notifications pages
 */
export class NotificationsPageModule {

}
