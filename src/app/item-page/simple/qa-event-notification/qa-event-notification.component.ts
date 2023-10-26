import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData, getPaginatedListPayload, getRemoteDataPayload } from '../../../core/shared/operators';
import { QualityAssuranceEventDataService } from '../../../core/suggestion-notifications/qa/events/quality-assurance-event-data.service';
import { QualityAssuranceTopicDataService } from '../../../core/suggestion-notifications/qa/topics/quality-assurance-topic-data.service';
import { QualityAssuranceTopicObject } from 'src/app/core/suggestion-notifications/qa/models/quality-assurance-topic.model';
import { Observable, concatMap, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { QualityAssuranceEventObject } from 'src/app/core/suggestion-notifications/qa/models/quality-assurance-event.model';
import { AlertType } from 'src/app/shared/alert/aletr-type';

@Component({
  selector: 'ds-qa-event-notification',
  templateUrl: './qa-event-notification.component.html',
  styleUrls: ['./qa-event-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QualityAssuranceTopicDataService, QualityAssuranceEventDataService]
})
export class QaEventNotificationComponent {

  @Input() item: Item;

  events: QualityAssuranceEventObject[] = [];

  AlertTypeInfo = AlertType.Info;

  constructor(
    private qualityAssuranceEventDataService: QualityAssuranceEventDataService,
    private qualityAssuranceTopicDataService: QualityAssuranceTopicDataService,
  ) { }

  ngOnInit(): void {
    this.getEventsByTopicsAndTarget();
  }

  getEventsByTopicsAndTarget(): void {
    // TODO: add source 'coar-notify'
 this.qualityAssuranceTopicDataService.getTopicsByTargetAndSource(this.item.id).pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        getPaginatedListPayload(),
        tap((topics: QualityAssuranceTopicObject[]) => console.log(topics, 'topics')),
        mergeMap((topics: QualityAssuranceTopicObject[]) => {
          return from(topics).pipe(
           concatMap((topic: QualityAssuranceTopicObject) => {
              return this.qualityAssuranceEventDataService.getEventsByTopicAndTarget(topic.name, this.item.id).pipe(
                tap((events: any) => console.log(events, 'events')),
              );
            } )
          );
        }),
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        getPaginatedListPayload(),
      ).subscribe((events: QualityAssuranceEventObject[]) => {
      this.events = events;
      console.log(events, 'events2')});
  }
}
