import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { MyDSpaceNewExternalDropdownComponent } from './my-dspace-new-external-dropdown.component';

/**
 * Themed wrapper for {@link MyDSpaceNewExternalDropdownComponent}
 */
@Component({
  selector: 'ds-my-dspace-new-external-dropdown',
  templateUrl: './../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports : [MyDSpaceNewExternalDropdownComponent],
})
export class ThemedMyDSpaceNewExternalDropdownComponent extends ThemedComponent<MyDSpaceNewExternalDropdownComponent> {

  protected getComponentName(): string {
    return 'MyDSpaceNewExternalDropdownComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/my-dspace-page/my-dspace-new-submission/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./my-dspace-new-external-dropdown.component');
  }
}
