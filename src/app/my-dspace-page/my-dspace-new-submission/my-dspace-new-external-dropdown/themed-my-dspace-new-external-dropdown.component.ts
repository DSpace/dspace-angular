import { Component } from '@angular/core';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { MyDSpaceNewExternalDropdownComponent } from './my-dspace-new-external-dropdown.component';

/**
 * Themed version of MyDSpaceNewExternalDropdownComponent
 */
@Component({
  selector: 'ds-themed-my-dspace-new-external-dropdown',
  templateUrl: './../../../shared/theme-support/themed.component.html',
})
export class ThemedMyDSpaceNewExternalDropdownComponent extends ThemedComponent<MyDSpaceNewExternalDropdownComponent> {
  /**
   * The name of the unthemed component
   */
  protected getComponentName(): string {
    return 'MyDSpaceNewExternalDropdownComponent';
  }

  /**
   * Import the themed component for a specific theme
   * @param themeName The name of the theme
   */
  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component`);
  }

  /**
   * Import the default unthemed component
   */
  protected importUnthemedComponent(): Promise<any> {
    return import(`./my-dspace-new-external-dropdown.component`);
  }
}
