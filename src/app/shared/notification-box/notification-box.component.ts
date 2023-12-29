import { Component, Input } from '@angular/core';
import {
  AdminNotifyMetricsBox
} from '../../admin/admin-notify-dashboard/admin-notify-metrics/admin-notify-metrics.model';

@Component({
  selector: 'ds-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.scss']
})
export class NotificationBoxComponent {
  @Input() boxConfig: AdminNotifyMetricsBox;
}
