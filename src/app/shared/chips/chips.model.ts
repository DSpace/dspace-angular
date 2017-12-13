
export class Chips {
  receivedItems: any[];
  chipsItems: ChipsItem[];

  constructor(items: any[] = []) {
    if (Array.isArray(items)) {
      this.receivedItems = items;
      this.setItems();
    }
  }

  public add(item: any) {
    let chipsItem: ChipsItem = {order: this.chipsItems.length, display: item.display, item: item};
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
      let chipsItem: ChipsItem = {order: index, display: item.display, item: item};
      this.chipsItems.push(chipsItem);
    })
  }


}


interface ChipsItem {
  order: number,
  display: string,
  item: any
}
