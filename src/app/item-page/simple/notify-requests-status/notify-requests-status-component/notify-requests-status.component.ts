import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, filter } from 'rxjs';
import {
  NotifyRequestsStatus,
  NotifyStatuses,
} from '../notify-requests-status.model';
import { NotifyRequestsStatusDataService } from '../../../../core/data/notify-services-status-data.service';
import { RequestStatusEnum } from '../notify-status.enum';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';
@Component({
  selector: 'ds-notify-requests-status',
  templateUrl: './notify-requests-status.component.html',
  styleUrls: ['./notify-requests-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifyRequestsStatusComponent implements OnInit, OnDestroy {
  /**
   * The UUID of the item.
   */
  @Input() itemUuid: string;

  /**
   * Map that stores the status of requests and their corresponding notify statuses.
   * The keys of the map are instances of the RequestStatusEnum enum,
   * and the values are arrays of NotifyStatuses objects.
   */
  statusMap: Map<RequestStatusEnum, NotifyStatuses[]> = new Map();

  /**
   * An array of subscriptions.
   */
  subs: Subscription[] = [];

  constructor(private notifyInfoService: NotifyRequestsStatusDataService) {}

  ngOnInit(): void {
    this.subs.push(
      this.notifyInfoService
        .getNotifyRequestsStatus(this.itemUuid)
        .pipe(
          getFirstCompletedRemoteData(),
          filter((data) => hasValue(data)),
          getRemoteDataPayload()
        )
        .subscribe((data: NotifyRequestsStatus) => {
          if (hasValue(data)) {
            this.groupDataByStatus(data);
          }
        })
    );
  }

  /**
   * Groups the notify requests status data by status.
   * @param notifyRequestsStatus The notify requests status data.
   */
  private groupDataByStatus(notifyRequestsStatus: NotifyRequestsStatus): void {
    notifyRequestsStatus.notifyStatus.forEach(
      (notifyStatus: NotifyStatuses) => {
        const status = notifyStatus.status;

        if (!this.statusMap.has(status)) {
          this.statusMap.set(status, []);
        }

        this.statusMap.get(status)?.push(notifyStatus);
      }
    );
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from any active subscriptions.
   */
  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (hasValue(sub)) {
        sub.unsubscribe();
      }
    });
  }
}
