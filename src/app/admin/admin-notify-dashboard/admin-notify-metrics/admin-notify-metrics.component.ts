import { Component, Input } from '@angular/core';
import { AdminNotifyMetricsRow } from './admin-notify-metrics.model';

@Component({
  selector: 'ds-admin-notify-metrics',
  templateUrl: './admin-notify-metrics.component.html',
})
export class AdminNotifyMetricsComponent {

  @Input()
  boxesConfig: AdminNotifyMetricsRow[];

  public navigateToSelectedSearchConfig($event: string) {
    console.log($event);
  }
}
