import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { ItemPageComponent } from './item-page.component';

/**
 * Themed wrapper for ItemPageComponent
 */
@Component({
  selector: 'ds-item-page',
  templateUrl: './../../shared/theme-support/themed.component.html',
})

export class ThemedItemPageComponent extends ThemedComponent<ItemPageComponent> {
  protected getComponentName(): string {
    return 'ItemPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/item-page/simple/item-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./item-page.component`);
  }

}
