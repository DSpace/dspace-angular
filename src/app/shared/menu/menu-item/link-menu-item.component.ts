import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { isNotEmpty } from '../../empty.util';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { MenuItemType } from '../menu-item-type.model';
import { LinkMenuItemModel } from './models/link.model';

/**
 * Component that renders a menu section of type LINK
 */
@Component({
  selector: 'ds-link-menu-item',
  styleUrls: ['./menu-item.component.scss'],
  templateUrl: './link-menu-item.component.html',
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
