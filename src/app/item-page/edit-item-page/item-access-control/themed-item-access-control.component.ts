import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { ItemAccessControlComponent } from './item-access-control.component';

/**
 * Themed wrapper for {@link ItemAccessControlComponent}, the item's "Access Control" edit tab.
 */
@Component({
  selector: 'ds-item-access-control',
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedItemAccessControlComponent extends ThemedComponent<ItemAccessControlComponent> {
  protected getComponentName(): string {
    return 'ItemAccessControlComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/edit-item-page/item-access-control/item-access-control.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-access-control.component');
  }

}
