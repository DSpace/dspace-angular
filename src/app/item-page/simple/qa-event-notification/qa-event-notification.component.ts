import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { Observable } from 'rxjs';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { RequestParam } from '../../../core/cache/models/request-param.model';
import { QualityAssuranceSourceDataService } from '../../../core/notifications/qa/source/quality-assurance-source-data.service';
import { QualityAssuranceSourceObject } from '../../../core/notifications/qa/models/quality-assurance-source.model';
import { map, tap } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
@Component({
  selector: 'ds-qa-event-notification',
  templateUrl: './qa-event-notification.component.html',
  styleUrls: ['./qa-event-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QualityAssuranceSourceDataService]
})
/**
 * Component for displaying quality assurance event notifications for an item.
 */
export class QaEventNotificationComponent {
  /**
   * The item to display quality assurance event notifications for.
   */
  @Input() item: Item;
  /**
   * The type of alert to display for the notification.
   */
  constructor(
    private qualityAssuranceSourceDataService: QualityAssuranceSourceDataService
  ) { }
  /**
   * Returns an Observable of QualityAssuranceSourceObject[] for the current item.
   * @returns An Observable of QualityAssuranceSourceObject[] for the current item.
   * Note: sourceId is composed as: id: "sourceName:<target>"
   */
  getQualityAssuranceSources$(): Observable<QualityAssuranceSourceObject[]> {
    const findListTopicOptions: FindListOptions = {
      searchParams: [new RequestParam('target', this.item.uuid)]
    };
    return this.qualityAssuranceSourceDataService.getSourcesByTarget(findListTopicOptions)
      .pipe(
        getFirstCompletedRemoteData(),
        tap(console.log),
        map((data: RemoteData<any>) => {
          if (data.hasSucceeded) {
            return data.payload.page;
          }
          return [];
        })
      );
  }
}
