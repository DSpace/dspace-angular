
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
      console.log(item);
      // REMOVE, ONLY FOR TEST
      let itemWithIcons = Object.assign({}, item);
      itemWithIcons['icons'] = ['fa fa-comments', 'fa fa-cutlery'];

      chipsItem = {
        order: this.chipsItems.length,
        display: textToDisplay,
        item: itemWithIcons};
    } else {
      const textToDisplay = item.length > 20 ? item.substr(0,17).concat('...') : item;
      // let itemInternal = Object.create({}).addAttribute(this.displayField, item);
      let itemInternal = {};
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
      if(item && item[this.displayField]) {
        const displayContent = item[this.displayField];
        const textToDisplay = item[this.displayField].length > 20 ? item[this.displayField].substr(0, 17).concat('...') : item[this.displayField];
        let chipsItem: ChipsItem = {order: index, display: textToDisplay, item: item};
        this.chipsItems.push(chipsItem);
      }
    })
  }




}


interface ChipsItem {
  order: number,
  display: string,
  item: any
}
