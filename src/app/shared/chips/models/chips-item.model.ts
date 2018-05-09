import { uniqueId } from 'lodash';
import { isNotEmpty } from '../../empty.util';

export interface ChipsItemIcon {
  style: string;
  tooltip?: any;
}

export class ChipsItem {
  public id: string;
  public display: string;
  public item: any;
  public editMode?: boolean;
  public icons?: ChipsItemIcon[];

  private fieldToDisplay: string;
  private objToDisplay: string;

  constructor(item: any,
              fieldToDisplay: string,
              objToDisplay: string,
              icons?: ChipsItemIcon[],
              editMode?: boolean) {

    this.id = uniqueId();
    this.item = item;
    this.fieldToDisplay = fieldToDisplay;
    this.objToDisplay = objToDisplay;
    this.setDisplayText();
    this.editMode = editMode || false;
    this.icons = icons || [];
  }

  hasIcons(): boolean {
    return isNotEmpty(this.icons);
  }

  setEditMode(): void {
    this.editMode = true;
  }

  updateIcons(icons: ChipsItemIcon[]): void {
    this.icons = icons;
  }

  updateItem(item: any): void {
    this.item = item;
    this.setDisplayText();
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
