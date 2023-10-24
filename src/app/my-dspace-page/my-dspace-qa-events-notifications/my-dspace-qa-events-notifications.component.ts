import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QualityAssuranceSourceDataService } from '../../core/suggestion-notifications/qa/source/quality-assurance-source-data.service';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { map } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { QualityAssuranceSourceObject } from 'src/app/core/suggestion-notifications/qa/models/quality-assurance-source.model';

@Component({
  selector: 'ds-my-dspace-qa-events-notifications',
  templateUrl: './my-dspace-qa-events-notifications.component.html',
  styleUrls: ['./my-dspace-qa-events-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyDspaceQaEventsNotificationsComponent {

  constructor(private qualityAssuranceSourceDataService: QualityAssuranceSourceDataService) { }

  ngOnInit(): void {
    this.getSources();
  }

  getSources() {
    this.qualityAssuranceSourceDataService.getSource('coar-notify')
    .pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<QualityAssuranceSourceObject>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Quality Assurance source');
        }
      })
    )
    .subscribe((sources) => {
      console.log(sources);
    });
  }
}
