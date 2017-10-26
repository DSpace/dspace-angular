import { Component, Input, Inject } from '@angular/core';

import { Item } from '../../core/shared/item.model';
import { gridElementFor } from '../grid-element-decorator';
import { ObjectGridElementComponent } from '../object-grid-element/object-grid-element.component';

@Component({
  selector: 'ds-item-grid-element',
  styleUrls: ['./item-grid-element.component.scss'],
  templateUrl: './item-grid-element.component.html'
})

@gridElementFor(Item)
export class ItemGridElementComponent extends ObjectGridElementComponent<Item> {}
