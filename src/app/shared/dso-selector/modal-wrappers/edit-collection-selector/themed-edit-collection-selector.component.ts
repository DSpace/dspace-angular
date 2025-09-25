import { Component } from '@angular/core';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

import { EditCollectionSelectorComponent } from './edit-collection-selector.component';

/**
 * Themed wrapper for EditCollectionSelectorComponent
 */
@Component({
  selector: 'ds-edit-collection-selector',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    EditCollectionSelectorComponent,
  ],
})
export class ThemedEditCollectionSelectorComponent
  extends ThemedComponent<EditCollectionSelectorComponent> {
  protected getComponentName(): string {
    return 'EditCollectionSelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./edit-collection-selector.component');
  }

}
