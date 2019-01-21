import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { VIEW_MODE_ELEMENT } from '../../../../../+item-page/simple/related-items/related-items-component';

@rendersItemType('Person', VIEW_MODE_ELEMENT)
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
