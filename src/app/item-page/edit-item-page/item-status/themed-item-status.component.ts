import { Component } from '@angular/core';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { ItemStatusComponent } from './item-status.component';

@Component({
  selector: 'ds-themed-item-status',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedItemStatusComponent extends ThemedComponent<ItemStatusComponent> {
  protected getComponentName(): string {
    return 'ItemStatusComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/edit-item-page/item-status/item-status.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-status.component');
  }

}
