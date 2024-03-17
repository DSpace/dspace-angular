import { Component } from '@angular/core';

import { ThemedSubmissionImportExternalComponent } from '../submission/import-external/themed-submission-import-external.component';

/**
 * Component representing the external import page of the submission.
 */
@Component({
  selector: 'ds-import-external-page',
  templateUrl: './import-external-page.component.html',
  styleUrls: ['./import-external-page.component.scss'],
  imports: [
    ThemedSubmissionImportExternalComponent,
  ],
  standalone: true,
})
export class ImportExternalPageComponent {

}
