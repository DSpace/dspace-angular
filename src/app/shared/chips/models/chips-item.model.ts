import { uniqueId, isObject } from 'lodash';
import { isNotEmpty } from '../../empty.util';

export interface ChipsItemIcon {
  metadata: string;
  style: string;
  tooltip?: any;
}

export class ChipsItem {
  public id: string;
  public display: string;
  private _item: any;
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
    this._item = item;
    this.fieldToDisplay = fieldToDisplay;
    this.objToDisplay = objToDisplay;
    this.setDisplayText();
    this.editMode = editMode || false;
    this.icons = icons || [];
  }

  public set item(item) {
    this._item = item;
  }

  public get item() {
    return this._item;
  }

  isNestedItem(): boolean {
    return (isNotEmpty(this.item)
      && isObject(this.item)
      && isNotEmpty(this.objToDisplay)
      && this.item[this.objToDisplay]);
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
    this._item = item;
    this.setDisplayText();
  }

  unsetEditMode(): void {
    this.editMode = false;
  }

  private setDisplayText(): void {
    let value = this._item;
    if (isObject(this._item)) {
      // Check If displayField is in an internal object
      const obj = this.objToDisplay ? this._item[this.objToDisplay] : this._item;

      if (isObject(obj) && obj) {
        value = obj[this.fieldToDisplay] || obj.value;
      } else {
        value = obj;
      }
    }

    this.display = value;
  }
}
