import { Component, Input, Inject } from '@angular/core';

import { Item } from '../../core/shared/item.model';
import { ObjectListElementComponent } from '../object-list-element/object-list-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../+search-page/search-options.model';

@Component({
  selector: 'ds-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html'
})

@renderElementsFor(Item, ViewMode.List)
export class ItemListElementComponent extends ObjectListElementComponent<Item> {}
