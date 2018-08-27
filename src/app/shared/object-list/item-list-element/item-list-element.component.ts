import { Component } from '@angular/core';

import { Item } from '../../../core/shared/item.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../core/shared/view-mode.model';

@Component({
  selector: 'ds-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html'
})

@renderElementsFor(Item, ViewMode.List)
export class ItemListElementComponent extends AbstractListableElementComponent<Item> {}
