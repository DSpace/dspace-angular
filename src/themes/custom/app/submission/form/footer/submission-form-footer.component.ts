import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';
import { BrowserOnlyPipe } from '../../../../../../app/shared/utils/browser-only.pipe';
import { SubmissionFormFooterComponent as BaseComponent } from '../../../../../../app/submission/form/footer/submission-form-footer.component';

@Component({
  selector: 'ds-themed-submission-form-footer',
  // styleUrls: ['./submission-form-footer.component.scss'],
  styleUrls: ['../../../../../../app/submission/form/footer/submission-form-footer.component.scss'],
  // templateUrl: './submission-form-footer.component.html'
  templateUrl: '../../../../../../app/submission/form/footer/submission-form-footer.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BrowserOnlyPipe,
    BtnDisabledDirective,
    TranslatePipe,
  ],
})
export class SubmissionFormFooterComponent extends BaseComponent {

}
