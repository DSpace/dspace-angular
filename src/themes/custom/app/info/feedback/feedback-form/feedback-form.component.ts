import { Component } from '@angular/core';

import { FeedbackFormComponent as BaseComponent } from '../../../../../../app/info/feedback/feedback-form/feedback-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ErrorComponent } from '../../../../../../app/shared/error/error.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-feedback-form',
  // templateUrl: './feedback-form.component.html',
  templateUrl: '../../../../../../app/info/feedback/feedback-form/feedback-form.component.html',
  // styleUrls: ['./feedback-form.component.scss'],
  styleUrls: ['../../../../../../app/info/feedback/feedback-form/feedback-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, ErrorComponent, TranslateModule]
})
export class FeedbackFormComponent extends BaseComponent {
}
