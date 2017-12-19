import { Component, Input, Inject } from '@angular/core';

import { Item } from '../../core/shared/item.model';
import { ObjectListElementComponent } from '../object-list-element/object-list-element.component';
import { listElementFor } from '../list-element-decorator';

@Component({
  selector: 'ds-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html'
})

@listElementFor(Item)
export class ItemListElementComponent extends ObjectListElementComponent<Item> {
  private lines = 3;
}
