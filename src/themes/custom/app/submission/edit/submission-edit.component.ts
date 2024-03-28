import { Component } from '@angular/core';

import { SubmissionEditComponent as BaseComponent } from '../../../../../app/submission/edit/submission-edit.component';
import { SubmissionFormComponent } from '../../../../../app/submission/form/submission-form.component';

/**
 * This component allows to edit an existing workspaceitem/workflowitem.
 */
@Component({
  selector: 'ds-themed-submission-edit',
  // styleUrls: ['./submission-edit.component.scss'],
  styleUrls: ['../../../../../app/submission/edit/submission-edit.component.scss'],
  // templateUrl: './submission-edit.component.html'
  templateUrl: '../../../../../app/submission/edit/submission-edit.component.html',
  standalone: true,
  imports: [
    SubmissionFormComponent,
  ],
})
export class SubmissionEditComponent extends BaseComponent {
}
