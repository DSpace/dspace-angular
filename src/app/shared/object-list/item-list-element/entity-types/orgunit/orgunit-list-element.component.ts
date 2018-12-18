import { Component } from '@angular/core';
import { rendersEntityType } from '../../../../entities/entity-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { EntitySearchResultComponent } from '../entity-search-result-component';

@rendersEntityType('OrgUnit', ElementViewMode.SetElement)
@Component({
  selector: 'ds-orgunit-list-element',
  styleUrls: ['./orgunit-list-element.component.scss'],
  templateUrl: './orgunit-list-element.component.html'
})
/**
 * The component for displaying a list element for an item with entity type Organisation Unit
 */
export class OrgUnitListElementComponent extends EntitySearchResultComponent {
}
