import { findIndex, isEqual, isObject } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChipsItem, ChipsItemIcon } from './chips-item.model';
import { hasValue, isNotEmpty } from '../../empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../form/builder/ds-dynamic-form-ui/models/dynamic-group/dynamic-group.model';

export interface IconsConfig {
  withAuthority?: {
    style: string;
  };

  withoutAuthority?: {
    style: string;
  };
}

export interface MetadataIconsConfig {
  name: string;
  config: IconsConfig;
}

export class Chips {
  chipsItems: BehaviorSubject<ChipsItem[]>;
  displayField: string;
  displayObj: string;
  iconsConfig: MetadataIconsConfig[];

  private _items: ChipsItem[];

  constructor(items: any[] = [],
              displayField: string = 'display',
              displayObj?: string,
              iconsConfig?: MetadataIconsConfig[]) {

    this.displayField = displayField;
    this.displayObj = displayObj;
    this.iconsConfig = iconsConfig || [];
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

  private hasPlaceholder(value) {
    if (isObject(value)) {
      return value.value === PLACEHOLDER_PARENT_METADATA;
    } else {
      return value === PLACEHOLDER_PARENT_METADATA;
    }
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
    const defaultConfigIndex: number = findIndex(this.iconsConfig, {name: 'default'});
    const defaultConfig: IconsConfig = (defaultConfigIndex !== -1) ? this.iconsConfig[defaultConfigIndex].config : undefined;
    let config: IconsConfig;
    let configIndex: number;
    let value: any;

    Object.keys(item)
      .forEach((metadata) => {

        value = item[metadata];
        configIndex = findIndex(this.iconsConfig, {name: metadata});

        config = (configIndex !== -1) ? this.iconsConfig[configIndex].config : defaultConfig;

        if (hasValue(value) && isNotEmpty(config) && !this.hasPlaceholder(value)) {

          let icon: ChipsItemIcon;
          const hasAuthority: boolean = !!(isObject(value) && ((value.hasOwnProperty('authority') && value.authority) || (value.hasOwnProperty('id') && value.id)));

          // Set icons
          if ((this.displayObj && this.displayObj === metadata && hasAuthority)
            || (this.displayObj && this.displayObj !== metadata)) {

            icon = {
              metadata,
              hasAuthority: hasAuthority,
              style: (hasAuthority) ? config.withAuthority.style : config.withoutAuthority.style
            };
          }
          if (icon) {
            icons.push(icon);
          }
        }
      });

    return icons;
  }

  /**
   * Sets initial items, used in edit mode
   */
  private setInitialItems(items: any[]): void {
    this._items = [];
    items.forEach((item) => {
      const icons = this.getChipsIcons(item);
      const chipsItem = new ChipsItem(item, this.displayField, this.displayObj, icons);
      this._items.push(chipsItem);
    });

    this.chipsItems = new BehaviorSubject<ChipsItem[]>(this._items);
  }
}
