import { isObject, uniqueId } from 'lodash';

import { isNotEmpty } from '../../empty.util';

export interface ChipsItemIcon {
  metadata: string;
  hasAuthority: boolean;
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
              fieldToDisplay: string = 'display',
              objToDisplay?: string,
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
    if (isObject(this.item)) {
      // Check If displayField is in an internal object
      const obj = this.objToDisplay ? this.item[this.objToDisplay] : this.item;

      if (isObject(obj) && obj) {
        value = obj[this.fieldToDisplay] || obj.value;
      } else {
        value = obj;
      }
    }

    this.display = value;
  }
}
