import { Component } from '@angular/core';

import { SubmissionFormFooterComponent as BaseComponent } from '../../../../../../app/submission/form/footer/submission-form-footer.component';

@Component({
  selector: 'ds-themed-submission-form-footer',
  // styleUrls: ['./submission-form-footer.component.scss'],
  styleUrls: ['../../../../../../app/submission/form/footer/submission-form-footer.component.scss'],
  // templateUrl: './submission-form-footer.component.html'
  templateUrl: '../../../../../../app/submission/form/footer/submission-form-footer.component.html',
  standalone: true,
})
export class SubmissionFormFooterComponent extends BaseComponent {

}
