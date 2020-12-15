import { Component, Inject } from '@angular/core';
import { OnClickMenuItemModel } from './models/onclick.model';

/**
 * Component that renders a menu section of type ONCLICK
 */
@Component({
  selector: 'ds-onclick-menu-item',
  styleUrls: ['./onclick-menu-item.component.scss'],
  templateUrl: './onclick-menu-item.component.html'
})
export class OnClickMenuItemComponent {
  item: OnClickMenuItemModel;
  constructor(@Inject('itemModelProvider') item: OnClickMenuItemModel) {
    this.item = item;
  }
}
