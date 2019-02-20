import { Component, Inject } from '@angular/core';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { OnClickMenuItemModel } from './models/onclick.model';

/**
 * Component that renders a menu section of type LINK
 */
@Component({
  selector: 'ds-onclick-menu-item',
  templateUrl: './onclick-menu-item.component.html'
})
@rendersMenuItemForType(MenuItemType.ONCLICK)
export class OnClickMenuItemComponent {
  item: OnClickMenuItemModel;
  constructor(@Inject('itemModelProvider') item: OnClickMenuItemModel, @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig) {
    this.item = item;
  }
}
