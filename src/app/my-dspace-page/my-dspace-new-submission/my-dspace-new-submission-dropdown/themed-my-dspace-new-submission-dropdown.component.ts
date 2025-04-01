import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { MyDSpaceNewSubmissionDropdownComponent } from './my-dspace-new-submission-dropdown.component';

/**
 * Themed wrapper for {@link MyDSpaceNewSubmissionDropdownComponent}
 */
@Component({
  selector: 'ds-my-dspace-new-submission-dropdown',
  templateUrl: './../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [MyDSpaceNewSubmissionDropdownComponent],
})
export class ThemedMyDSpaceNewSubmissionDropdownComponent extends ThemedComponent<MyDSpaceNewSubmissionDropdownComponent> {

  protected getComponentName(): string {
    return 'MyDSpaceNewSubmissionDropdownComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./my-dspace-new-submission-dropdown.component');
  }
}
