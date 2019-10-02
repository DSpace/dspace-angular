import { Component } from '@angular/core';

import { Item } from '../../../core/shared/item.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';

@Component({
  selector: 'ds-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html'
})

/**
 * The component used to list items depending on type
 * Uses item-type-switcher to determine which components to use for displaying the list
 */
@listableObjectComponent(Item, ViewMode.ListElement)
export class ItemListElementComponent extends AbstractListableElementComponent<Item> {
  viewMode = ViewMode.ListElement;
}
