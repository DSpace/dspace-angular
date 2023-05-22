import { Component } from '@angular/core';
import { ThemedComponent } from '../../../../shared/theme-support/themed.component';
import { UntypedItemComponent } from './untyped-item.component';

/**
 * Themed wrapper for UntypedItemPageComponent
 */
@Component({
  selector: 'ds-themed-untyped-item',
  styleUrls: [],
  templateUrl: './../../../../shared/theme-support/themed.component.html',
})

export class ThemedUntypedItemComponent extends ThemedComponent<UntypedItemComponent> {
  protected getComponentName(): string {
    return 'UntypedItemComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/item-page/simple/untyped-item/untyped-item.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./untyped-item.component`);
  }

}
