import {
  AsyncPipe,
  KeyValuePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  filter,
  map,
  Observable,
} from 'rxjs';

import { NotifyRequestsStatusDataService } from '../../../../core/data/notify-services-status-data.service';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';
import {
  NotifyRequestsStatus,
  NotifyStatuses,
} from '../notify-requests-status.model';
import { RequestStatusEnum } from '../notify-status.enum';
import { RequestStatusAlertBoxComponent } from '../request-status-alert-box/request-status-alert-box.component';

@Component({
  selector: 'ds-notify-requests-status',
  templateUrl: './notify-requests-status.component.html',
  styleUrls: ['./notify-requests-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    KeyValuePipe,
    RequestStatusAlertBoxComponent,
  ],
})

/**
 * Component to show an alert box for each update in th Notify feature (e.g. COAR updates)
 */

export class NotifyRequestsStatusComponent implements OnInit {
  /**
   * The UUID of the item.
   */
  @Input() itemUuid: string;

  /**
   * Observable representing the request map.
   * The map contains request status enums as keys and arrays of notify statuses as values.
   */
  requestMap$: Observable<Map<RequestStatusEnum, NotifyStatuses[]>>;

  constructor(private notifyInfoService: NotifyRequestsStatusDataService) { }

  ngOnInit(): void {
    this.requestMap$ = this.notifyInfoService
      .getNotifyRequestsStatus(this.itemUuid)
      .pipe(
        getFirstCompletedRemoteData(),
        filter((data) => hasValue(data)),
        getRemoteDataPayload(),
        filter((data: NotifyRequestsStatus) => hasValue(data)),
        map((data: NotifyRequestsStatus) => {
          return this.groupDataByStatus(data);
        }),
      );
  }

  /**
   * Groups the notify requests status data by status.
   * @param notifyRequestsStatus The notify requests status data.
   */
  private groupDataByStatus(notifyRequestsStatus: NotifyRequestsStatus) {
    const statusMap: Map<RequestStatusEnum, NotifyStatuses[]> = new Map();
    notifyRequestsStatus.notifyStatus?.forEach(
      (notifyStatus: NotifyStatuses) => {
        const status = notifyStatus.status;

        if (!statusMap.has(status)) {
          statusMap.set(status, []);
        }

        statusMap.get(status)?.push(notifyStatus);
      },
    );

    return statusMap;
  }
}
