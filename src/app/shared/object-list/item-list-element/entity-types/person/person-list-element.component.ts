import { Component } from '@angular/core';
import { rendersEntityType } from '../../../../entities/entity-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { EntitySearchResultComponent } from '../entity-search-result-component';

@rendersEntityType('Person', ElementViewMode.SetElement)
@Component({
  selector: 'ds-person-list-element',
  styleUrls: ['./person-list-element.component.scss'],
  templateUrl: './person-list-element.component.html'
})
/**
 * The component for displaying a list element for an item with entity type Person
 */
export class PersonListElementComponent extends EntitySearchResultComponent {
}
