import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { Component } from '@angular/core';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { MetadataRepresentationType } from '../../../../../core/shared/metadata-representation/metadata-representation.model';

@rendersItemType('OrgUnit', ItemViewMode.Element, MetadataRepresentationType.Item)
@Component({
  selector: 'ds-orgunit-metadata-list-element',
  templateUrl: './orgunit-metadata-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type OrgUnit
 */
export class OrgUnitMetadataListElementComponent extends TypedItemSearchResultListElementComponent {
}
