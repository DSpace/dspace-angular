import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { QualityAssuranceSourceDataService } from '../../core/suggestion-notifications/qa/source/quality-assurance-source-data.service';
import { getFirstCompletedRemoteData, getPaginatedListPayload, getRemoteDataPayload } from '../../core/shared/operators';
import { Observable, of, tap } from 'rxjs';
import { QualityAssuranceSourceObject } from 'src/app/core/suggestion-notifications/qa/models/quality-assurance-source.model';

@Component({
  selector: 'ds-my-dspace-qa-events-notifications',
  templateUrl: './my-dspace-qa-events-notifications.component.html',
  styleUrls: ['./my-dspace-qa-events-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyDspaceQaEventsNotificationsComponent  implements OnInit {

  sources$: Observable<QualityAssuranceSourceObject[]> = of([]);

  constructor(private qualityAssuranceSourceDataService: QualityAssuranceSourceDataService) { }

  ngOnInit(): void {
    this.getSources();
  }

  getSources() {
    this.sources$ = this.qualityAssuranceSourceDataService.getSources()
    .pipe(
      getFirstCompletedRemoteData(),
      tap((rd) => {
        if (rd.hasFailed) {
          throw new Error('Can\'t retrieve Quality Assurance sources');
        }
      }),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
    );
  }
}
