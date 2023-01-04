import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { UpdateDataService } from '../../../core/data/update-data.service';
import { ItemMetadataComponent } from './item-metadata.component';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';

@Component({
  selector: 'ds-themed-item-metadata',
  styleUrls: [],
  templateUrl: './../../../shared/theme-support/themed.component.html',
})
/**
 * Component for displaying an item's metadata edit page
 */
export class ThemedItemMetadataComponent extends ThemedComponent<ItemMetadataComponent> {

  @Input() item: Item;

  @Input() updateService: UpdateDataService<Item>;

  protected inAndOutputNames: (keyof ItemMetadataComponent & keyof this)[] = ['item', 'updateService'];

  protected getComponentName(): string {
    return 'ItemMetadataComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/edit-item-page/item-metadata/item-metadata.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./item-metadata.component`);
  }
}
