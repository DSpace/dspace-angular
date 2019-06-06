import { Component } from '@angular/core';
import { DEFAULT_ITEM_TYPE, ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';

@rendersItemType('Publication', ItemViewMode.Element)
@rendersItemType(DEFAULT_ITEM_TYPE, ItemViewMode.Element)
@Component({
  selector: 'ds-publication-list-element',
  styleUrls: ['./publication-list-element.component.scss'],
  templateUrl: './publication-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Publication
 */
export class PublicationListElementComponent extends TypedItemSearchResultListElementComponent {
}
