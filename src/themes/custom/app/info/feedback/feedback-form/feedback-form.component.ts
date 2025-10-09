import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FeedbackFormComponent as BaseComponent } from '../../../../../../app/info/feedback/feedback-form/feedback-form.component';
import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';
import { ErrorComponent } from '../../../../../../app/shared/error/error.component';

@Component({
  selector: 'ds-themed-feedback-form',
  // templateUrl: './feedback-form.component.html',
  templateUrl: '../../../../../../app/info/feedback/feedback-form/feedback-form.component.html',
  // styleUrls: ['./feedback-form.component.scss'],
  styleUrls: ['../../../../../../app/info/feedback/feedback-form/feedback-form.component.scss'],
  standalone: true,
  imports: [
    BtnDisabledDirective,
    ErrorComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class FeedbackFormComponent extends BaseComponent {
}
