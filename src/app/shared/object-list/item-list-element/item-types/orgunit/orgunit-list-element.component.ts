import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { ItemSearchResultComponent } from '../item-search-result-component';

@rendersItemType('OrgUnit', ElementViewMode.SetElement)
@Component({
  selector: 'ds-orgunit-list-element',
  styleUrls: ['./orgunit-list-element.component.scss'],
  templateUrl: './orgunit-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Organisation Unit
 */
export class OrgUnitListElementComponent extends ItemSearchResultComponent {
}
