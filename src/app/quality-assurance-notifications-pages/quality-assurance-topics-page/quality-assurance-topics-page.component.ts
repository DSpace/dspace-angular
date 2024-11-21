import { Component } from '@angular/core';

import { QualityAssuranceTopicsComponent } from '../../notifications/qa/topics/quality-assurance-topics.component';

/**
 * Component for the page that show the QA topics related to a specific source.
 */
@Component({
  selector: 'ds-notification-qa-page',
  templateUrl: './quality-assurance-topics-page.component.html',
  standalone: true,
  imports: [QualityAssuranceTopicsComponent],
})
export class QualityAssuranceTopicsPageComponent {

}
