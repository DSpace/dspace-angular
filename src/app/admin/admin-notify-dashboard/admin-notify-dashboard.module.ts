import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { AdminNotifyDashboardRoutingModule } from './admin-notify-dashboard-routing.module';
import { AdminNotifyMetricsComponent } from './admin-notify-metrics/admin-notify-metrics.component';
import { AdminNotifyIncomingComponent } from './admin-notify-logs/admin-notify-incoming/admin-notify-incoming.component';
import { SharedModule } from '../../shared/shared.module';
import { SearchModule } from '../../shared/search/search.module';
import { SearchPageModule } from '../../search-page/search-page.module';
import { AdminNotifySearchResultComponent } from './admin-notify-search-result/admin-notify-search-result.component';
import {
  AdminNotifyOutgoingComponent
} from './admin-notify-logs/admin-notify-outgoing/admin-notify-outgoing.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AdminNotifyDashboardRoutingModule,
    SearchModule,
    SearchPageModule,
  ],
  declarations: [
    AdminNotifyDashboardComponent,
    AdminNotifyMetricsComponent,
    AdminNotifyIncomingComponent,
    AdminNotifyOutgoingComponent,
    AdminNotifySearchResultComponent
  ]
})
export class AdminNotifyDashboardModule {

}
