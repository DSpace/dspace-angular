import { Component, Input } from '@angular/core';
import { AdminNotifyMetricsRow } from './admin-notify-metrics.model';

@Component({
  selector: 'ds-admin-notify-metrics',
  templateUrl: './admin-notify-metrics.component.html',
  styleUrls: ['./admin-notify-metrics.component.scss']
})
export class AdminNotifyMetricsComponent {

  @Input()
  boxesConfig: AdminNotifyMetricsRow[];
}
