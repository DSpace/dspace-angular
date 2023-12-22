import { Component } from '@angular/core';
import { AdminNotifyMetricsRow } from "./admin-notify-metrics.model";
import { AdminNotifyMetricsRowsConfig } from "./admin-notify-metrics.config";

@Component({
  selector: 'ds-admin-notify-metrics',
  templateUrl: './admin-notify-metrics.component.html',
  styleUrls: ['./admin-notify-metrics.component.scss']
})
export class AdminNotifyMetricsComponent {

  boxesConfig: AdminNotifyMetricsRow[] = AdminNotifyMetricsRowsConfig;
}
