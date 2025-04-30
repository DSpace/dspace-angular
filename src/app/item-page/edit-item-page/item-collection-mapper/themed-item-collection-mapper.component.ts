import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { ItemCollectionMapperComponent } from './item-collection-mapper.component';

@Component({
  selector: 'ds-item-collection-mapper',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [ItemCollectionMapperComponent],
})
export class ThemedItemCollectionMapperComponent extends ThemedComponent<ItemCollectionMapperComponent> {

  protected getComponentName(): string {
    return 'ItemCollectionMapperComponent';
  }
  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/edit-item-page/item-collection-mapper/item-collection-mapper.component`);
  }
  protected importUnthemedComponent(): Promise<any> {
    return import(`./item-collection-mapper.component`);
  }

}
