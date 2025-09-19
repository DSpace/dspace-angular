import { NgStyle } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AdminNotifyMetricsBox } from '../../admin/admin-notify-dashboard/admin-notify-metrics/admin-notify-metrics.model';
import { AdminNotifySearchResult } from '../../admin/admin-notify-dashboard/models/admin-notify-message-search-result.model';
import { ViewMode } from '../../core/shared/view-mode.model';
import { HoverClassDirective } from '../hover-class.directive';
import { listableObjectComponent } from '../object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent(AdminNotifySearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.scss'],
  standalone: true,
  imports: [
    HoverClassDirective,
    NgStyle,
    TranslateModule,
  ],
})
/**
 * Component to display the count of notifications for each type of LDN message and to access the related filtered search
 * (each box works as a filter button setting a specific search configuration)
 */
export class NotificationBoxComponent {
  @Input() boxConfig: AdminNotifyMetricsBox;
  @Output() selectedBoxConfig: EventEmitter<string> = new EventEmitter();

  public onClick(boxConfig: AdminNotifyMetricsBox) {
    this.selectedBoxConfig.emit(boxConfig.config);
  }
}
