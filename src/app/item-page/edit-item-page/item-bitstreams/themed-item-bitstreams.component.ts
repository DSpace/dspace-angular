import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { ItemBitstreamsComponent } from './item-bitstreams.component';
import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';

/**
 * Themed wrapper for {@link ItemBitstreamsComponent}
 */
@Component({
  selector: 'ds-themed-item-bitstreams',
  styleUrls: ['./item-bitstreams.component.scss'],
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedItemBitstreamsComponent extends ThemedComponent<ItemBitstreamsComponent> {
  @Input() item: Item;

  protected inAndOutputNames: (keyof ItemBitstreamsComponent & keyof this)[] = [
    'item',
  ];

  protected getComponentName(): string {
    return 'ItemBitstreamsComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/edit-item-page/item-bitstreams/item-bitstreams.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./item-bitstreams.component`);
  }
}
