import { Component } from '@angular/core';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../../../../shared/object-list/item-list-element/item-types/typed-item-search-result-list-element.component';

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
