import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotifyRequestsStatus, NotifyStatuses } from '../notify-requests-status.model';
import { NotifyRequestsStatusDataService } from 'src/app/core/data/notify-services-status-data.service';
import { RequestStatusEnum } from '../notify-status.enum';

@Component({
  selector: 'ds-notify-requests-status',
  templateUrl: './notify-requests-status.component.html',
  styleUrls: ['./notify-requests-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifyRequestsStatusComponent {

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

  notifyRequestStatus$: Observable<NotifyRequestsStatus> = of( Object.assign(new NotifyRequestsStatus(), {
    notifyStatuses: [
      {
        serviceName: 'test',
        serviceUrl: 'test',
        status: RequestStatusEnum.ACCEPTED,
      },
      {
        serviceName: 'test1',
        serviceUrl: 'test',
        status: RequestStatusEnum.ACCEPTED,
      },
      {
        serviceName: 'Review Platform',
        serviceUrl: 'test',
        status: RequestStatusEnum.ACCEPTED,
      },
      {
        serviceName: 'Demo Environment',
        serviceUrl: 'test',
        status: RequestStatusEnum.ACCEPTED,
      },
      {
        serviceName: 'Additional Information',
        serviceUrl: 'test',
        status: RequestStatusEnum.ACCEPTED,
      },
      {
        serviceName: 'Notification Service',
        serviceUrl: 'test',
        status: RequestStatusEnum.ACCEPTED,
      },
      {
        serviceName: 'test2',
        serviceUrl: 'test',
        status: RequestStatusEnum.REJECTED,
      },
      {
        serviceName: 'test3',
        serviceUrl: 'test',
        status: RequestStatusEnum.REQUESTED,
      },
      {
        serviceName: 'test4',
        serviceUrl: 'test',
        status: RequestStatusEnum.REQUESTED,
      }
    ],
    itemUuid: '8d5fda2d-f380-467e-a86b-0436ac699dab',
  }));

  constructor(
    private notifyInfoService: NotifyRequestsStatusDataService,
  ) { }

 ngOnInit(): void {
  this.notifyInfoService.getNotifyRequestsStatus(this.itemUuid).subscribe((data) => {
    console.log(data, 'asdasdsa');
 });

  this.notifyRequestStatus$.subscribe((data) => {
    this.groupDataByStatus(data);
    console.log(this.statusMap);
  });
 }

  /**
   * Groups the notify requests status data by status.
   * @param notifyRequestsStatus The notify requests status data.
   */
  private groupDataByStatus(notifyRequestsStatus: NotifyRequestsStatus): void {
    notifyRequestsStatus.notifyStatuses.forEach((notifyStatus: NotifyStatuses) => {
      const status = notifyStatus.status;

      if (!this.statusMap.has(status)) {
        this.statusMap.set(status, []);
      }

      this.statusMap.get(status)?.push(notifyStatus);
    });
  }
}
