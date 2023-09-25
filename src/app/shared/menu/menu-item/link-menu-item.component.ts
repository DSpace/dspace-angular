import { Component, Inject, OnInit } from '@angular/core';
import { LinkMenuItemModel } from './models/link.model';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { isNotEmpty } from '../../empty.util';
import { MenuItemType } from '../menu-item-type.model';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

/**
 * Component that renders a menu section of type LINK
 */
@Component({
    selector: 'ds-link-menu-item',
    templateUrl: './link-menu-item.component.html',
    standalone: true,
    imports: [NgClass, RouterLink, TranslateModule]
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
      return this.item.link;
    }
    return undefined;
  }

  navigate(event: any) {
    event.preventDefault();
    if (!this.item.disabled && this.getRouterLink()) {
      this.router.navigate([this.getRouterLink()]);
    }
    event.stopPropagation();
  }

}
