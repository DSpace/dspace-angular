import { Component } from '@angular/core';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

import { EditItemSelectorComponent } from './edit-item-selector.component';

/**
 * Themed wrapper for EditItemSelectorComponent
 */
@Component({
  selector: 'ds-edit-item-selector',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    EditItemSelectorComponent,
  ],
})
export class ThemedEditItemSelectorComponent
  extends ThemedComponent<EditItemSelectorComponent> {
  protected getComponentName(): string {
    return 'EditItemSelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./edit-item-selector.component');
  }

}
