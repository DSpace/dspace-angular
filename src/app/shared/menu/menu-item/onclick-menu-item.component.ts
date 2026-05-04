import {
  Component,
  Inject,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { rendersMenuItemForType } from '../menu-item.decorator';
import { MenuItemType } from '../menu-item-type.model';
import { OnClickMenuItemModel } from './models/onclick.model';

/**
 * Component that renders a menu section of type ONCLICK
 */
@Component({
  selector: 'ds-onclick-menu-item',
  styleUrls: ['./menu-item.component.scss', './onclick-menu-item.component.scss'],
  templateUrl: './onclick-menu-item.component.html',
  imports: [
    RouterLinkActive,
    TranslateModule,
  ],
})
@rendersMenuItemForType(MenuItemType.ONCLICK)
export class OnClickMenuItemComponent {

  constructor(
    @Inject('itemModelProvider') public item: OnClickMenuItemModel,
    @Inject('useAriaMenuRoles') public useAriaMenuRoles: boolean,
  ) {
  }

  public activate(event: any) {
    if (!this.item.disabled) {
      event.preventDefault();
      this.item.function();
      event.stopPropagation();
    }
  }
}
