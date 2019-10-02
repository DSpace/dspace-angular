import { Component } from '@angular/core';

import { Item } from '../../../core/shared/item.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';

@Component({
  selector: 'ds-item-grid-element',
  styleUrls: ['./item-grid-element.component.scss'],
  templateUrl: './item-grid-element.component.html'
})

@listableObjectComponent(Item, ViewMode.GridElement)
export class ItemGridElementComponent extends AbstractListableElementComponent<Item> {}
