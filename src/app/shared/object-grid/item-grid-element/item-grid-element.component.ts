import { Component, Inject, Input } from '@angular/core';

import { Item } from '../../../core/shared/item.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

@Component({
  selector: 'ds-item-grid-element',
  styleUrls: ['./item-grid-element.component.scss'],
  templateUrl: './item-grid-element.component.html'
})

@renderElementsFor(Item, ViewMode.Grid)
export class ItemGridElementComponent extends AbstractListableElementComponent<Item> {}
