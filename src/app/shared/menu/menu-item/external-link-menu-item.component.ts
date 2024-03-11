import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';

import { isNotEmpty } from '../../empty.util';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { MenuItemType } from '../menu-item-type.model';
import { ExternalLinkMenuItemModel } from './models/external-link.model';

/**
 * Component that renders a menu section of type EXTERNAL
 */
@Component({
  selector: 'ds-external-link-menu-item',
  styleUrls: ['./menu-item.component.scss'],
  templateUrl: './external-link-menu-item.component.html',
})
@rendersMenuItemForType(MenuItemType.EXTERNAL)
export class ExternalLinkMenuItemComponent implements OnInit {
  item: ExternalLinkMenuItemModel;

  hasLink: boolean;

  constructor(
    @Inject('itemModelProvider') item: ExternalLinkMenuItemModel,
  ) {
    this.item = item;
  }

  ngOnInit() {
    this.hasLink = isNotEmpty(this.item.href);
  }

  get href() {
    if (this.hasLink) {
      return this.item.href;
    }
    return undefined;
  }
}
