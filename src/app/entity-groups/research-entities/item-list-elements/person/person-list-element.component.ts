import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { PersonSearchResultListElementComponent } from '../search-result-list-elements/person/person-search-result-list-element.component';

@listableObjectComponent('Person', ViewMode.ListElement)
@Component({
  selector: 'ds-person-list-element',
  styleUrls: ['./person-list-element.component.scss'],
  templateUrl: './person-list-element.component.html',
  standalone: true,
  imports: [
    PersonSearchResultListElementComponent,
  ],
})
/**
 * The component for displaying a list element for an item of the type Person
 */
export class PersonListElementComponent extends AbstractListableElementComponent<Item> {
}
