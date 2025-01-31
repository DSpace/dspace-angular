import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../core/shared/item.model';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { ItemBitstreamsComponent } from './item-bitstreams.component';

/**
 * Themed wrapper for {@link ItemBitstreamsComponent}
 */
@Component({
  selector: 'ds-item-bitstreams',
  templateUrl: '../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [ItemBitstreamsComponent],
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
