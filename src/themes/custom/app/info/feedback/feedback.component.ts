import { Component } from '@angular/core';

import { FeedbackComponent as BaseComponent } from '../../../../../app/info/feedback/feedback.component';
import { ThemedFeedbackFormComponent } from '../../../../../app/info/feedback/feedback-form/themed-feedback-form.component';

@Component({
  selector: 'ds-themed-feedback',
  // styleUrls: ['./feedback.component.scss'],
  styleUrls: ['../../../../../app/info/feedback/feedback.component.scss'],
  // templateUrl: './feedback.component.html'
  templateUrl: '../../../../../app/info/feedback/feedback.component.html',
  standalone: true,
  imports: [
    ThemedFeedbackFormComponent,
  ],
})
export class FeedbackComponent extends BaseComponent {
}
