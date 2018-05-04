import { findIndex, isEqual } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChipsItem, ChipsItemIcon } from './chips-item.model';
import { GlobalConfig } from '../../../../config/global-config.interface';
import { hasValue } from '../../empty.util';
import { FormFieldMetadataValueObject } from '../../form/builder/models/form-field-metadata-value.model';

export class Chips {
  chipsItems: BehaviorSubject<ChipsItem[]>;
  displayField: string;
  displayObj: string;
  EnvConfig: GlobalConfig

  private _items: ChipsItem[];

  constructor(EnvConfig: GlobalConfig,
              items: any[] = [],
              displayField: string = 'display',
              displayObj?: string) {

    this.EnvConfig = EnvConfig;
    this.displayField = displayField;
    this.displayObj = displayObj;
    if (Array.isArray(items)) {
      this.setInitialItems(items);
    }
  }

  public add(item: any): void {
    const icons = this.getChipsIcons(item);
    const chipsItem = new ChipsItem(item, this.displayField, this.displayObj, icons);

    const duplicatedIndex = findIndex(this._items, {display: chipsItem.display.trim()});
    if (duplicatedIndex === -1 || !isEqual(item, this.getChipByIndex(duplicatedIndex).item)) {
      this._items.push(chipsItem);
      this.chipsItems.next(this._items);
    }
  }

  public getChipById(id): ChipsItem {
    const index = findIndex(this._items, {id: id});
    return this.getChipByIndex(index);
  }

  public getChipByIndex(index): ChipsItem {
    if (this._items.length > 0 && this._items[index]) {
      return this._items[index];
    } else {
      return null;
    }
  }

  public getChips(): ChipsItem[] {
    return this._items;
  }

  /**
   * To use to get items before to store it
   * @returns {any[]}
   */
  public getChipsItems(): any[] {
    const out = [];
    this._items.forEach((item) => {
      out.push(item.item);
    });
    return out;
  }

  public hasItems(): boolean {
    return this._items.length > 0;
  }

  public remove(chipsItem: ChipsItem): void {
    const index = findIndex(this._items, {id: chipsItem.id});
    this._items.splice(index, 1);
    this.chipsItems.next(this._items);
  }

  public update(id: string, item: any): void {
    const chipsItemTarget = this.getChipById(id);
    const icons = this.getChipsIcons(item);

    chipsItemTarget.updateItem(item);
    chipsItemTarget.updateIcons(icons);
    chipsItemTarget.unsetEditMode();
    this.chipsItems.next(this._items);
  }

  public updateOrder(): void {
    this.chipsItems.next(this._items);
  }

  private getChipsIcons(item) {
    const icons = [];
    Object.keys(item)
      .forEach((metadata) => {
        const value = item[metadata];
        if (hasValue(value)
          && value instanceof FormFieldMetadataValueObject
          && value.authority
          && this.EnvConfig.submission.metadata.icons.hasOwnProperty(metadata)) {

          const icon: ChipsItemIcon = {
            style: this.EnvConfig.submission.metadata.icons[metadata]
          };
          icons.push(icon);
        }
      });

    return icons;
  }

  /**
   * Sets initial items, used in edit mode
   */
  private setInitialItems(items: any[]): void {
    this._items = [];
    items.forEach((item, index) => {
      const icons = this.getChipsIcons(item);
      const chipsItem = new ChipsItem(item, this.displayField, this.displayObj, icons);
      this._items.push(chipsItem);
    });

    this.chipsItems = new BehaviorSubject<ChipsItem[]>(this._items);
  }
}
