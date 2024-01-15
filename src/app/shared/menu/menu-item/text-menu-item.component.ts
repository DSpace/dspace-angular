import { Component, Inject } from '@angular/core';
import { TextMenuItemModel } from './models/text.model';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Component that renders a menu section of type TEXT
 */
@Component({
    selector: 'ds-text-menu-item',
    templateUrl: './text-menu-item.component.html',
    standalone: true,
    imports: [TranslateModule]
})
export class TextMenuItemComponent {
  item: TextMenuItemModel;
  constructor(@Inject('itemModelProvider') item: TextMenuItemModel) {
    this.item = item;
  }
}
