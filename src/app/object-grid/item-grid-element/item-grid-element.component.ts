import { Component, Input, Inject } from '@angular/core';

import { Item } from '../../core/shared/item.model';
import { renderElementsFor} from '../../object-collection/shared/dso-element-decorator';
import { ObjectGridElementComponent } from '../object-grid-element/object-grid-element.component';
import { ViewMode } from '../../+search-page/search-options.model';

@Component({
  selector: 'ds-item-grid-element',
  styleUrls: ['./item-grid-element.component.scss'],
  templateUrl: './item-grid-element.component.html'
})

@renderElementsFor(Item, ViewMode.Grid)
export class ItemGridElementComponent extends ObjectGridElementComponent<Item> {}
