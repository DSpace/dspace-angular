import { Component, Input } from '@angular/core';

import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html'
})
export class ItemListElementComponent {
  @Input() item: Item;

  data: any = {};

}
