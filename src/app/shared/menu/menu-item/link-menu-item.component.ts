import { Component, Inject, Input } from '@angular/core';
import { LinkMenuItemModel } from './models/link.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';

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
  constructor(@Inject('itemModelProvider') item: LinkMenuItemModel, @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig) {
    this.item = item;
  }

  getRouterLink() {
    return this.EnvConfig.ui.nameSpace + this.item.link;
  }
}
