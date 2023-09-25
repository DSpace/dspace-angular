import { Component } from '@angular/core';
import { ThemedFeedbackFormComponent } from './feedback-form/themed-feedback-form.component';

@Component({
    selector: 'ds-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
    standalone: true,
    imports: [ThemedFeedbackFormComponent]
})
/**
 * Component displaying the Feedback Statement
 */
export class FeedbackComponent {
}
