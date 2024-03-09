import { Item } from 'src/app/core/shared/item.model';

export class FilteredItems {

  public items: Item[] = [];
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
