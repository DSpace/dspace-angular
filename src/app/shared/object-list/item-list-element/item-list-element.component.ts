import { Component } from '@angular/core';

import { Item } from '../../../core/shared/item.model';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { SetViewMode } from '../../view-mode';
import { ItemViewMode } from '../../items/item-type-decorator';

@Component({
  selector: 'ds-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html'
})

/**
 * The component used to list items depending on type
 * Uses item-type-switcher to determine which components to use for displaying the list
 */
@renderElementsFor(Item, SetViewMode.List)
export class ItemListElementComponent extends AbstractListableElementComponent<Item> {
  viewMode = ItemViewMode.Element;
}
