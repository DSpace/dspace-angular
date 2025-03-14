import { Component } from '@angular/core';

import { SubmissionFormComponent as BaseComponent } from '../../../../../app/submission/form/submission-form.component';

@Component({
  selector: 'ds-themed-submission-form',
  // styleUrls: ['./submission-form.component.scss'],
  styleUrls: ['../../../../../app/submission/form/submission-form.component.scss'],
  // templateUrl: './submission-form.component.html'
  templateUrl: '../../../../../app/submission/form/submission-form.component.html',
  standalone: true,
})
export class SubmissionFormComponent extends BaseComponent {

}
