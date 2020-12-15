import { Component, Inject } from '@angular/core';
import { TextMenuItemModel } from './models/text.model';

/**
 * Component that renders a menu section of type TEXT
 */
@Component({
  selector: 'ds-text-menu-item',
  templateUrl: './text-menu-item.component.html',
})
export class TextMenuItemComponent {
  item: TextMenuItemModel;
  constructor(@Inject('itemModelProvider') item: TextMenuItemModel) {
    this.item = item;
  }
}
