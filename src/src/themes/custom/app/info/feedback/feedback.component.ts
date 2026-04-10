import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FeedbackComponent as BaseComponent } from '../../../../../app/info/feedback/feedback.component';
import { ThemedFeedbackFormComponent } from '../../../../../app/info/feedback/feedback-form/themed-feedback-form.component';

@Component({
  selector: 'ds-themed-feedback',
  styleUrls: ['./feedback.component.scss'],
  templateUrl: './feedback.component.html',
  imports: [
    ThemedFeedbackFormComponent,
    TranslatePipe,
  ],
})
export class FeedbackComponent extends BaseComponent {
}
