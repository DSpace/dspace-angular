export class Chips {
  chipsItems: ChipsItem[];
  displayField: string;

  constructor(items: any[] = [], displayField: string = 'display') {
    if (Array.isArray(items)) {
      this.setInitialItems(items);
    }
    this.displayField = displayField;
  }

  public add(item: any) {
    let chipsItem: ChipsItem;
    let value = item;
    if (item && item[this.displayField]) {
      value = item[this.displayField];
    } else if (item && item['dc.contributor.author'] && item['dc.contributor.author'].display) {
      // Case Group Form
      value = item['dc.contributor.author'].display;
    }
    const textToDisplay = value.length > 20 ? value.substr(0, 17).concat('...') : value;
    chipsItem = {
      order: this.chipsItems.length,
      display: textToDisplay,
      item: item,
    };

    this.chipsItems.push(chipsItem);
  }

  public remove(index) {
    this.chipsItems.splice(index, 1);
  }

  /**
   * Sets initial items, used in edit mode
   */
  private setInitialItems(items: any[]) {
    this.chipsItems = [];
    items.forEach((item, index) => {
      let value;
      if (item instanceof String) {
        value = item;
      } else {
        value = item[this.displayField];
      }
      const textToDisplay = value.length > 20 ? value.substr(0, 17).concat('...') : value;
      const chipsItem: ChipsItem = {order: index, display: textToDisplay, item: item};
      this.chipsItems.push(chipsItem);
      // }
    })
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

  setDiplayField(displayField) {
    this.displayField = displayField;
  }

}

interface ChipsItem {
  order: number,
  display: string,
  item: any
}
