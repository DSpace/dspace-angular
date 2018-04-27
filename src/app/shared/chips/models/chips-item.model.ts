import { uniqueId } from 'lodash';

export class ChipsItem {
  public id: string;
  public display: string;
  public item: any;
  public editMode?: boolean;
  public icons?: string[];

  private fieldToDisplay: string;
  private objToDisplay: string;

  constructor(item: any,
              fieldToDisplay: string,
              objToDisplay: string,
              icons?: string[],
              editMode?: boolean) {

    this.id = uniqueId();
    this.item = item;
    this.fieldToDisplay = fieldToDisplay;
    this.objToDisplay = objToDisplay;
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
      const obj = this.objToDisplay ? this.item[this.objToDisplay] : this.item;
      const displayFieldBkp = 'value';

      if (obj instanceof Object && obj && obj[this.fieldToDisplay]) {
        value = obj[this.fieldToDisplay];
      } else if (obj instanceof Object && obj && obj[displayFieldBkp]) {
        value = obj[displayFieldBkp];
      } else {
        value = obj;
      }
    }

    this.display = value;
  }
}
