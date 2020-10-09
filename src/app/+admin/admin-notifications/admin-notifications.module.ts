import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminNotificationsRoutingModule } from './admin-notifications-routing.module';
import { AdminNotificationsOpenairebrokerPageComponent } from './admin-notifications-openairebroker-page/admin-notifications-openairebroker-page.component';
import { OpenaireModule } from '../../openaire/openaire.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    AdminNotificationsRoutingModule,
    OpenaireModule
  ],
  declarations: [
    AdminNotificationsOpenairebrokerPageComponent
  ],
  entryComponents: []
})
/**
 * This module handles all components related to the notifications pages
 */
export class AdminNotificationsModule {

}
