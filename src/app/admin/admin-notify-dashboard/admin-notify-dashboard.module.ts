import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { AdminNotifyDashboardRoutingModule } from './admin-notify-dashboard-routing.module';
import { AdminNotifyMetricsComponent } from './admin-notify-metrics/admin-notify-metrics.component';
import { AdminNotifyIncomingComponent } from './admin-notify-logs/admin-notify-incoming/admin-notify-incoming.component';
import { SharedModule } from '../../shared/shared.module';
import { SearchModule } from '../../shared/search/search.module';
import { SearchPageModule } from '../../search-page/search-page.module';
import {
  AdminNotifyOutgoingComponent
} from './admin-notify-logs/admin-notify-outgoing/admin-notify-outgoing.component';
import { AdminNotifyDetailModalComponent } from './admin-notify-detail-modal/admin-notify-detail-modal.component';
import {
  AdminNotifySearchResultComponent
} from './admin-notify-search-result/admin-notify-search-result.component';
import { AdminNotifyMessagesService } from './services/admin-notify-messages.service';
import { AdminNotifyLogsResultComponent } from './admin-notify-logs/admin-notify-logs-result/admin-notify-logs-result.component';


const ENTRY_COMPONENTS = [
  AdminNotifySearchResultComponent
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AdminNotifyDashboardRoutingModule,
    SearchModule,
    SearchPageModule
  ],
  providers: [
    AdminNotifyMessagesService,
    DatePipe
  ],
  declarations: [
    ...ENTRY_COMPONENTS,
    AdminNotifyDashboardComponent,
    AdminNotifyMetricsComponent,
    AdminNotifyIncomingComponent,
    AdminNotifyOutgoingComponent,
    AdminNotifyDetailModalComponent,
    AdminNotifySearchResultComponent,
    AdminNotifyLogsResultComponent
  ]
})
export class AdminNotifyDashboardModule {
  static withEntryComponents() {
    return {
      ngModule: AdminNotifyDashboardModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
