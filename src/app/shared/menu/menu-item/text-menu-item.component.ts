import {
  Component,
  Inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { rendersMenuItemForType } from '../menu-item.decorator';
import { MenuItemType } from '../menu-item-type.model';
import { TextMenuItemModel } from './models/text.model';

/**
 * Component that renders a menu section of type TEXT
 */
@Component({
  selector: 'ds-text-menu-item',
  styleUrls: ['./menu-item.component.scss'],
  templateUrl: './text-menu-item.component.html',
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
@rendersMenuItemForType(MenuItemType.TEXT)
export class TextMenuItemComponent {
  item: TextMenuItemModel;
  constructor(@Inject('itemModelProvider') item: TextMenuItemModel) {
    this.item = item;
  }
}
