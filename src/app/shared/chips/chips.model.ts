export class Chips {
  chipsItems: ChipsItem[];
  displayField: string;
  displayObj: string;

  constructor(items: any[] = [], displayField: string = 'display', displayObj?: string) {
    if (Array.isArray(items)) {
      this.setInitialItems(items);
    }
    this.displayField = displayField;
    this.displayObj = displayObj;
  }

  public add(item: any) {
    let chipsItem = {
      order: this.chipsItems.length,
      display: this.getDisplayText(item),
      editMode: false,
      item: item,
    };
    this.chipsItems.push(chipsItem);
  }

  public remove(index) {
    this.chipsItems.splice(index, 1);
  }

  public update(chipsItem: ChipsItem) {

  }

  /**
   * Sets initial items, used in edit mode
   */
  private setInitialItems(items: any[]) {
    this.chipsItems = [];
    items.forEach((item, index) => {
      let chipsItem = {
        order: this.chipsItems.length,
        display: this.getDisplayText(item),
        editMode: false,
        item: item,
      };
      this.chipsItems.push(chipsItem);
    })
  }

  private getDisplayText(item: any) {
    let value = item;
    let obj = item;
    if(this.displayObj) {
      // If displayField is in an internal object
      obj = item[this.displayObj];
    }

    if (obj && obj[this.displayField]) {
      value = obj[this.displayField];
    }
    // else if (obj && obj['dc.contributor.author'] && obj['dc.contributor.author'].display) {
    //   // Case Group Form
    //   value = item['dc.contributor.author'].display;
    // }
    const textToDisplay = value.length > 20 ? value.substr(0, 17).concat('...') : value;
    return textToDisplay;

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

interface ChipsItem {
  order: number,
  display: string,
  editMode?: boolean,
  item: any
}
