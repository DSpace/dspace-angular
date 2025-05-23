import { Component } from '@angular/core';

import { SubmissionEditComponent as BaseComponent } from '../../../../../app/submission/edit/submission-edit.component';
import { ThemedSubmissionFormComponent } from '../../../../../app/submission/form/themed-submission-form.component';

@Component({
  selector: 'ds-themed-submission-edit',
  // styleUrls: ['./submission-edit.component.scss'],
  styleUrls: ['../../../../../app/submission/edit/submission-edit.component.scss'],
  // templateUrl: './submission-edit.component.html'
  templateUrl: '../../../../../app/submission/edit/submission-edit.component.html',
  standalone: true,
  imports: [
    ThemedSubmissionFormComponent,
  ],
})
export class SubmissionEditComponent extends BaseComponent {
}
