import { findIndex } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChipsItem } from './chips-item.model';

export class Chips {
  // chipsItems: ChipsItem[];
  displayField: string;
  displayObj: string;
  chipsItems: BehaviorSubject<ChipsItem[]>;

  private _items: ChipsItem[];

  constructor(items: any[] = [], displayField: string = 'display', displayObj?: string) {
    this.displayField = displayField;
    this.displayObj = displayObj;
    if (Array.isArray(items)) {
      this.setInitialItems(items);
    }
  }

  public add(item: any): void {
    const chipsItem = new ChipsItem(item, this.displayField, this.displayObj);

    const duplicated = findIndex(this._items, {display: chipsItem.display.trim()});
    if (duplicated === -1) {
      this._items.push(chipsItem);
      this.chipsItems.next(this._items);
    }
  }

  public getChipByIndex(index): ChipsItem {
    if (this._items.length > 0 && this._items[index]) {
      return this._items[index];
    } else {
      return null;
    }
  }

  public getChips(): ChipsItem[] {
    return this._items;
  }

  /**
   * To use to get items before to store it
   * @returns {any[]}
   */
  public getChipsItems(): any[] {
    const out = [];
    this._items.forEach((item) => {
      out.push(item.item);
    });
    return out;
  }

  public hasItems(): boolean {
    return this._items.length > 0;
  }

  public remove(chipsItem: ChipsItem): void {
    const index = findIndex(this._items, {id: chipsItem.id});
    this._items.splice(index, 1);
    this.chipsItems.next(this._items);
  }

  public update(chipsItem: ChipsItem): void {
    const index = findIndex(this._items, {id: chipsItem.id});
    const chipsItemTarget = this.getChipByIndex(index);
    chipsItemTarget.updateItem(chipsItem.item);
    chipsItemTarget.unsetEditMode();
    this.chipsItems.next(this._items);
  }

  public updateOrder(): void {
    this.chipsItems.next(this._items);
  }

  /**
   * Sets initial items, used in edit mode
   */
  private setInitialItems(items: any[]): void {
    this._items = [];
    items.forEach((item, index) => {
      const chipsItem = new ChipsItem(item, this.displayField, this.displayObj);
      this._items.push(chipsItem);
    });

    this.chipsItems = new BehaviorSubject<ChipsItem[]>(this._items);
  }
}
