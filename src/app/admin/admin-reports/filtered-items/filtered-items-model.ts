import { Item } from 'src/app/core/shared/item.model';

import { Collection } from '../../../core/shared/collection.model';

export class FilteredItems {

  public items: FilteredItem[] = [];
  public itemCount: number;

  public clear() {
    this.items.splice(0, this.items.length);
  }

  public deserialize(object: any, offset: number = 0) {
    this.clear();
    this.itemCount = object.itemCount;
    const items = object.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.index = this.items.length + offset + 1;
      this.items.push(item);
    }
  }

}

export interface FilteredItem extends Omit<Item, 'owningCollection'> {
  index: number;
  owningCollection?: Collection;
}
