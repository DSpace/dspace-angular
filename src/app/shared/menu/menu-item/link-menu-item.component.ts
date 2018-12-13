import { Component, Inject, Input } from '@angular/core';
import { LinkMenuItemModel } from './models/link.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';

/**
 * Component that renders a menu section of type LINK
 */
@Component({
  selector: 'ds-link-menu-item',
  templateUrl: './link-menu-item.component.html'
})
@rendersMenuItemForType(MenuItemType.LINK)
export class LinkMenuItemComponent {
  item: LinkMenuItemModel;
  constructor(@Inject('itemModelProvider') item: LinkMenuItemModel) {
    this.item = item;
  }
}
