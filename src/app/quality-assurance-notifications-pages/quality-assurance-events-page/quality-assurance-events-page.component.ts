import { Component } from '@angular/core';

import { QualityAssuranceEventsComponent } from '../../notifications/qa/events/quality-assurance-events.component';

/**
 * Component for the page that show the QA events related to a specific topic.
 */
@Component({
  selector: 'ds-quality-assurance-events-page',
  templateUrl: './quality-assurance-events-page.component.html',
  standalone: true,
  imports: [
    QualityAssuranceEventsComponent,
  ],
})
export class QualityAssuranceEventsPageComponent {

}
