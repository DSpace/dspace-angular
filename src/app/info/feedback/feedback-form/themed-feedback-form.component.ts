import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { FeedbackFormComponent } from './feedback-form.component';

/**
 * Themed wrapper for {@link FeedbackFormComponent}
 */
@Component({
  selector: 'ds-feedback-form',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    FeedbackFormComponent,
  ],
})
export class ThemedFeedbackFormComponent extends ThemedComponent<FeedbackFormComponent> {

  protected getComponentName(): string {
    return 'FeedbackFormComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/info/feedback/feedback-form/feedback-form.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./feedback-form.component');
  }

}
