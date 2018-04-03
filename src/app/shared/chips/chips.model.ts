import { findIndex, uniqueId } from 'lodash';

export class Chips {
  chipsItems: ChipsItem[];
  displayField: string;
  displayObj: string;

  constructor(items: any[] = [], displayField: string = 'display', displayObj?: string) {
    this.displayField = displayField;
    this.displayObj = displayObj;
    if (Array.isArray(items)) {
      this.setInitialItems(items);
    }
  }

  public add(item: any) {
    const chipsItem = {
      id: uniqueId(),
      display: this.getDisplayText(item),
      editMode: false,
      item: item,
    };

    const duplicated = findIndex(this.chipsItems, {display: chipsItem.display.trim()});
    if (duplicated === -1) {
      this.chipsItems.push(chipsItem);
    }
  }

  public remove(index) {
    this.chipsItems.splice(index, 1);
  }

  public update(chipsItem: ChipsItem) {
    const index = findIndex(this.chipsItems, {id: chipsItem.id});
    const chipsItemTarget = this.chipsItems[index];
    chipsItemTarget.item = chipsItem.item;
    chipsItemTarget.display = this.getDisplayText(chipsItemTarget.item);
    chipsItemTarget.editMode = false;
  }

  /**
   * Sets initial items, used in edit mode
   */
  private setInitialItems(items: any[]) {
    this.chipsItems = [];
    items.forEach((item, index) => {
      const chipsItem = {
        id: uniqueId(),
        // order: this.chipsItems.length,
        display: this.getDisplayText(item),
        editMode: false,
        item: item,
      };
      this.chipsItems.push(chipsItem);
    })
  }

  private getDisplayText(item: any) {
    let value = item;
    if ( typeof item === 'object') {
      // Check If displayField is in an internal object
      const obj = this.displayObj ? item[this.displayObj] : item;
      const displayFieldBkp = 'value';

      if (obj instanceof Object && obj && obj[this.displayField]) {
        value = obj[this.displayField];
      } else if (obj instanceof Object && obj && obj[displayFieldBkp]) {
        value = obj[displayFieldBkp];
      } else {
        value = obj;
      }
    }

    return value;
  }

  /**
   * To use to get items before to store it
   * @returns {any[]}
   */
  public getItems(): any[] {
    const out = [];
    this.chipsItems.forEach((item) => {
      out.push(item.item);
    });
    return out;
  }

}

export interface ChipsItem {
  id: string,
  display: string,
  editMode?: boolean,
  item: any
}
