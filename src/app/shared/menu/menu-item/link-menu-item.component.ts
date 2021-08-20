import { Component, Inject, Input, OnInit } from '@angular/core';
import { LinkMenuItemModel } from './models/link.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { isNotEmpty } from '../../empty.util';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

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
  constructor(
    @Inject('itemModelProvider') item: LinkMenuItemModel,
    private router: Router,
  ) {
    this.item = item;
  }

  ngOnInit(): void {
    this.hasLink = isNotEmpty(this.item.link);
  }

  getRouterLink() {
    if (this.hasLink) {
      return environment.ui.nameSpace + this.item.link;
    }
    return undefined;
  }

  navigate(event: any) {
    event.preventDefault();
    if (this.getRouterLink()) {
      this.router.navigate([this.getRouterLink()]);
    }
    event.stopPropagation();
  }

}
