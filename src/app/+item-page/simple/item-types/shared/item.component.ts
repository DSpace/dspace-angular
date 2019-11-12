import { Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent {

  constructor(
    @Inject(ITEM) public item: Item
  ) {}

}
