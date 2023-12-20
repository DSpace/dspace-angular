import { Component } from '@angular/core';
import { QualityAssuranceSourceComponent } from '../../../notifications/qa/source/quality-assurance-source.component';

/**
 * Component for the page that show the QA sources.
 */
@Component({
    selector: 'ds-admin-quality-assurance-source-page-component',
    templateUrl: './admin-quality-assurance-source-page.component.html',
    standalone: true,
    imports: [QualityAssuranceSourceComponent]
})
export class AdminQualityAssuranceSourcePageComponent {}
