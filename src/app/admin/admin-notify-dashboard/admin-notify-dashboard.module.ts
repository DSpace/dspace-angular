import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminNotifyDashboardComponent } from "./admin-notify-dashboard.component";
import { AdminNotifyDashboardRoutingModule } from "./admin-notify-dashboard-routing.module";
import { AdminNotifyMetricsComponent } from './admin-notify-metrics/admin-notify-metrics.component';
import { AdminNotifyLogsComponent } from './admin-notify-logs/admin-notify-logs.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    AdminNotifyDashboardRoutingModule,
  ],
  declarations: [
    AdminNotifyDashboardComponent,
    AdminNotifyMetricsComponent,
    AdminNotifyLogsComponent
  ]
})
export class AdminNotifyDashboardModule {

}
