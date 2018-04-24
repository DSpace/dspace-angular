import { uniqueId } from 'lodash';

export class ChipsItem {
  public id: string;
  public display: string;
  public item: any;
  public editMode?: boolean;
  public icons?: string[];

  private displayField: string;
  private displayObj: string;

  constructor(item: any,
              displayField: string,
              displayObj: string,
              icons?: string[],
              editMode?: boolean) {

    this.id = uniqueId();
    this.item = item;
    this.displayField = displayField;
    this.displayObj = displayObj;
    this.setDisplayText();
    this.editMode = editMode || false;
    this.icons = icons || [];
  }

  setEditMode(): void {
    this.editMode = true;
  }

  updateItem(item: any): void {
    this.item = item;
  }

  unsetEditMode(): void {
    this.editMode = false;
  }

  private setDisplayText(): void {
    let value = this.item;
    if ( typeof this.item === 'object') {
      // Check If displayField is in an internal object
      const obj = this.displayObj ? this.item[this.displayObj] : this.item;
      const displayFieldBkp = 'value';

      if (obj instanceof Object && obj && obj[this.displayField]) {
        value = obj[this.displayField];
      } else if (obj instanceof Object && obj && obj[displayFieldBkp]) {
        value = obj[displayFieldBkp];
      } else {
        value = obj;
      }
    }

    this.display = value;
  }
}
