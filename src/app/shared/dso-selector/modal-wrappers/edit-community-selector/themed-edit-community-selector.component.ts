import { Component } from '@angular/core';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

import { EditCommunitySelectorComponent } from './edit-community-selector.component';

/**
 * Themed wrapper for EditCommunitySelectorComponent
 */
@Component({
  selector: 'ds-edit-community-selector',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    EditCommunitySelectorComponent,
  ],
})
export class ThemedEditCommunitySelectorComponent
  extends ThemedComponent<EditCommunitySelectorComponent> {
  protected getComponentName(): string {
    return 'EditCommunitySelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./edit-community-selector.component');
  }

}
