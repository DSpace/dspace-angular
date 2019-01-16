import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { ItemSearchResultComponent } from '../item-search-result-component';

@rendersItemType('Person', ElementViewMode.SetElement)
@Component({
  selector: 'ds-person-list-element',
  styleUrls: ['./person-list-element.component.scss'],
  templateUrl: './person-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Person
 */
export class PersonListElementComponent extends ItemSearchResultComponent {
}
