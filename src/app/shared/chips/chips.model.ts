
export class Chips {
  receivedItems: any[];
  chipsItems: ChipsItem[];
  displayField: string;

  constructor(items: any[] = [], displayField: string = 'display') {
    if (Array.isArray(items)) {
      this.receivedItems = items;
      this.setItems();
    }
    this.displayField = displayField;
  }

  public add(item: any) {
    let chipsItem: ChipsItem;
    if (item && item[this.displayField]) {
      const textToDisplay = item[this.displayField].length > 20 ? item[this.displayField].substr(0,17).concat('...') : item[this.displayField];

      chipsItem = {
        order: this.chipsItems.length,
        display: textToDisplay,
        item: item};
    } else {
      const textToDisplay = item.length > 20 ? item.substr(0,17).concat('...') : item;
      const itemInternal = {};
      itemInternal[this.displayField] = item;
      chipsItem = {order: this.chipsItems.length, display: textToDisplay, item: itemInternal};
    }

    this.chipsItems.push(chipsItem);
    this.receivedItems.push(item);
  }

  public remove(index) {
    this.receivedItems.splice(index,1);
    this.chipsItems.splice(index,1);
  }

  private setItems() {
    this.chipsItems = [];
    this.receivedItems.forEach((item, index) => {
      if (item && item[this.displayField]) {
        const displayContent = item[this.displayField];
        const textToDisplay = item[this.displayField].length > 20 ? item[this.displayField].substr(0, 17).concat('...') : item[this.displayField];
        const chipsItem: ChipsItem = {order: index, display: textToDisplay, item: item};
        this.chipsItems.push(chipsItem);
      }
    })
  }

  public getItems(): any[] {
    const out = [];
    this.chipsItems.forEach((item) => {
          out.push(item.item);
        });
    return out;
  }

}

interface ChipsItem {
  order: number,
  display: string,
  item: any
}
