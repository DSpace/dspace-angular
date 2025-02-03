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

  /**
   * The name of the unthemed component
   */
  protected getComponentName(): string {
    // Must match the class name of the original component exactly
    return 'MyDSpaceNewSubmissionDropdownComponent';
  }

  /**
   * Import the themed component for a specific theme
   * @param themeName The name of the theme
   */
  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component`);
  }

  /**
   * Import the default unthemed component
   */
  protected importUnthemedComponent(): Promise<any> {
    return import(`./my-dspace-new-submission-dropdown.component`);
  }
}
