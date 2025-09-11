import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { PersonSearchResultGridElementComponent } from '../search-result-grid-elements/person/person-search-result-grid-element.component';

@listableObjectComponent('Person', ViewMode.GridElement)
@Component({
  selector: 'ds-person-grid-element',
  styleUrls: ['./person-grid-element.component.scss'],
  templateUrl: './person-grid-element.component.html',
  standalone: true,
  imports: [
    PersonSearchResultGridElementComponent,
  ],
})
/**
 * The component for displaying a grid element for an item of the type Person
 */
export class PersonGridElementComponent extends AbstractListableElementComponent<Item> {
}
