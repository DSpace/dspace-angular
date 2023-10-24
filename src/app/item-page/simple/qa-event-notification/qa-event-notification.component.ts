import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { QualityAssuranceEventDataService } from '../../../core/suggestion-notifications/qa/events/quality-assurance-event-data.service';
import { QualityAssuranceTopicDataService } from '../../../core/suggestion-notifications/qa/topics/quality-assurance-topic-data.service';

@Component({
  selector: 'ds-qa-event-notification',
  templateUrl: './qa-event-notification.component.html',
  styleUrls: ['./qa-event-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QualityAssuranceTopicDataService, QualityAssuranceEventDataService]
})
export class QaEventNotificationComponent {

  @Input() item: Item;

  constructor(
    protected qualityAssuranceEventDataService: QualityAssuranceEventDataService,
    protected qualityAssuranceTopicDataService: QualityAssuranceTopicDataService,
  ) { }

  ngOnInit(): void {
    this.getTopics();
  }

  getTopics(): void {
      this.qualityAssuranceTopicDataService.getTopicsByTargetAndSource(this.item.id, 'coar-notify', {}, true, true).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((topics) => {
        console.log(topics);
      });
  }
}
