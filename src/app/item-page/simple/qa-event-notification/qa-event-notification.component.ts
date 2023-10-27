import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData, getPaginatedListPayload, getRemoteDataPayload } from '../../../core/shared/operators';
import { QualityAssuranceEventDataService } from '../../../core/suggestion-notifications/qa/events/quality-assurance-event-data.service';
import { QualityAssuranceTopicDataService } from '../../../core/suggestion-notifications/qa/topics/quality-assurance-topic-data.service';
import { QualityAssuranceTopicObject } from '../../../core/suggestion-notifications/qa/models/quality-assurance-topic.model';
import { Observable, concatMap, from, mergeMap } from 'rxjs';
import { QualityAssuranceEventObject } from '../../../core/suggestion-notifications/qa/models/quality-assurance-event.model';
import { AlertType } from '../../../shared/alert/aletr-type';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { RequestParam } from '../../../core/cache/models/request-param.model';

@Component({
  selector: 'ds-qa-event-notification',
  templateUrl: './qa-event-notification.component.html',
  styleUrls: ['./qa-event-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QualityAssuranceTopicDataService, QualityAssuranceEventDataService]
})
/**
 * Component for displaying quality assurance event notifications for an item.
 */
export class QaEventNotificationComponent implements OnInit {

  /**
   * The item to display quality assurance event notifications for.
   */
  @Input() item: Item;

  /**
   * An observable of quality assurance events for the item.
   */
  events$: Observable<QualityAssuranceEventObject[]>;

  /**
   * The type of alert to display for the notification.
   */
  AlertTypeInfo = AlertType.Info;

  /**
   * The source of the quality assurance events.
   */
  source = 'coar-notify';

  constructor(
    private qualityAssuranceEventDataService: QualityAssuranceEventDataService,
    private qualityAssuranceTopicDataService: QualityAssuranceTopicDataService,
  ) { }

  ngOnInit() {
    this.getEventsByTopicsAndTarget();
  }

  /**
   * Retrieves quality assurance events by topics and target.
   * First, it retrieves the topics by target and source.
   *  -> target: item.id
   *  -> source: 'coar-notify'
   * Then, it retrieves the events by topic and target.
   */
  getEventsByTopicsAndTarget() {
    const findListTopicOptions: FindListOptions = {
      searchParams: [new RequestParam('source', this.source), new RequestParam('target', this.item.id)]
    };

    // const findListEventOptions: FindListOptions = {
    //   searchParams: [new RequestParam('topic', topic.name), new RequestParam('target', this.item.id)]
    // };

    this.events$ = this.qualityAssuranceTopicDataService.getTopics(findListTopicOptions).pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        getPaginatedListPayload(),
        mergeMap((topics: QualityAssuranceTopicObject[]) => {
          return from(topics).pipe(
           concatMap((topic: QualityAssuranceTopicObject) => {
            const findListEventOptions: FindListOptions = {
              searchParams: [new RequestParam('topic', topic.name), new RequestParam('target', this.item.id)]
            };
              return this.qualityAssuranceEventDataService.searchEventsByTopic(findListEventOptions);
            } )
          );
        }),
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        getPaginatedListPayload(),
      );
  }
}
