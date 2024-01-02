import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { AdminNotifyDashboardRoutingModule } from './admin-notify-dashboard-routing.module';
import { AdminNotifyMetricsComponent } from './admin-notify-metrics/admin-notify-metrics.component';
import { AdminNotifyLogsComponent } from './admin-notify-logs/admin-notify-logs.component';
import { SharedModule } from '../../shared/shared.module';
import { SearchModule } from "../../shared/search/search.module";
import { SearchPageModule } from "../../search-page/search-page.module";


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
    AdminNotifyLogsComponent
  ]
})
export class AdminNotifyDashboardModule {

}
