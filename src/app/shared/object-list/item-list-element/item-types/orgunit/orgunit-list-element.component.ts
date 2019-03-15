import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { VIEW_MODE_ELEMENT } from '../../../../../+item-page/simple/related-items/related-items-component';

@rendersItemType('OrgUnit', VIEW_MODE_ELEMENT)
@Component({
  selector: 'ds-orgunit-list-element',
  styleUrls: ['./orgunit-list-element.component.scss'],
  templateUrl: './orgunit-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Organisation Unit
 */
export class OrgUnitListElementComponent extends TypedItemSearchResultListElementComponent {
}
