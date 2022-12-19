import { Component } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { ItemBackButtonComponent } from './item-back-button.component';

@Component({
  selector: 'ds-themed-item-back-button',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedItemBackButtonComponent extends ThemedComponent<ItemBackButtonComponent> {
  protected getComponentName(): string {
    return 'ItemBackButtonComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/item-back-button/item-back-button.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./item-back-button.component`);
  }

}
