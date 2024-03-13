import {
  CommonModule,
  DatePipe,
} from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchPageModule } from '../../search-page/search-page.module';
import { SearchModule } from '../../shared/search/search.module';
import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { AdminNotifyDashboardRoutingModule } from './admin-notify-dashboard-routing.module';
import { AdminNotifyDetailModalComponent } from './admin-notify-detail-modal/admin-notify-detail-modal.component';
import { AdminNotifyIncomingComponent } from './admin-notify-logs/admin-notify-incoming/admin-notify-incoming.component';
import { AdminNotifyLogsResultComponent } from './admin-notify-logs/admin-notify-logs-result/admin-notify-logs-result.component';
import { AdminNotifyOutgoingComponent } from './admin-notify-logs/admin-notify-outgoing/admin-notify-outgoing.component';
import { AdminNotifyMetricsComponent } from './admin-notify-metrics/admin-notify-metrics.component';
import { AdminNotifySearchResultComponent } from './admin-notify-search-result/admin-notify-search-result.component';
import { AdminNotifyMessagesService } from './services/admin-notify-messages.service';

const ENTRY_COMPONENTS = [
  AdminNotifySearchResultComponent,
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminNotifyDashboardRoutingModule,
    SearchModule,
    SearchPageModule,
    ...ENTRY_COMPONENTS,
    AdminNotifyDashboardComponent,
    AdminNotifyMetricsComponent,
    AdminNotifyIncomingComponent,
    AdminNotifyOutgoingComponent,
    AdminNotifyDetailModalComponent,
    AdminNotifySearchResultComponent,
    AdminNotifyLogsResultComponent,
  ],
  providers: [
    AdminNotifyMessagesService,
    DatePipe,
  ],
})
export class AdminNotifyDashboardModule {
  static withEntryComponents() {
    return {
      ngModule: AdminNotifyDashboardModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
    };
  }
}
