import { Component } from '@angular/core';

import { QualityAssuranceSourceComponent } from '../../notifications/qa/source/quality-assurance-source.component';

/**
 * Component for the page that show the QA sources.
 */
@Component({
  selector: 'ds-quality-assurance-source-page-component',
  templateUrl: './quality-assurance-source-page.component.html',
  imports: [
    QualityAssuranceSourceComponent,
  ],
  standalone: true,
})
export class QualityAssuranceSourcePageComponent {}
