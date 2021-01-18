import { Component, Inject, Input } from '@angular/core';
import { TextMenuItemModel } from './models/text.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';

/**
 * Component that renders a menu section of type TEXT
 */
@Component({
  selector: 'ds-text-menu-item',
  templateUrl: './text-menu-item.component.html',
})
@rendersMenuItemForType(MenuItemType.TEXT)
export class TextMenuItemComponent {
  item: TextMenuItemModel;
  constructor(@Inject('itemModelProvider') item: TextMenuItemModel) {
    this.item = item;
  }
}
