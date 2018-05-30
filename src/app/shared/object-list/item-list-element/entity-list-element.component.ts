import { Component } from '@angular/core';

import { Item } from '../../../core/shared/item.model';
import * as viewMode from '../../../shared/view-mode';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { SetViewMode } from '../../view-mode';

@Component({
  selector: 'ds-entity-list-element',
  styleUrls: ['./entity-list-element.component.scss'],
  templateUrl: './entity-list-element.component.html'
})

@renderElementsFor(Item, SetViewMode.List)
export class EntityListElementComponent extends AbstractListableElementComponent<Item> {
  ElementViewMode = viewMode.ElementViewMode;
}
