import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';

@rendersItemType('Person', ItemViewMode.Element)
@Component({
  selector: 'ds-person-list-element',
  styleUrls: ['./person-list-element.component.scss'],
  templateUrl: './person-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Person
 */
export class PersonListElementComponent extends TypedItemSearchResultListElementComponent {
}
