import { Component, Inject, Input, OnInit } from '@angular/core';
import { LinkMenuItemModel } from './models/link.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { isNotEmpty } from '../../empty.util';

/**
 * Component that renders a menu section of type LINK
 */
@Component({
  selector: 'ds-link-menu-item',
  templateUrl: './link-menu-item.component.html'
})
@rendersMenuItemForType(MenuItemType.LINK)
export class LinkMenuItemComponent implements OnInit {
  item: LinkMenuItemModel;
  hasLink: boolean;
  constructor(@Inject('itemModelProvider') item: LinkMenuItemModel, @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig) {
    this.item = item;
  }

  ngOnInit(): void {
    this.hasLink = isNotEmpty(this.item.link);
  }

  getRouterLink() {
    if (this.hasLink) {
      return this.EnvConfig.ui.nameSpace + this.item.link;
    }
    return undefined;
  }

}
