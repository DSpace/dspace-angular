import { Component } from '@angular/core';
import { DEFAULT_ITEM_TYPE, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { VIEW_MODE_ELEMENT } from '../../../../../+item-page/simple/related-items/related-items-component';

@rendersItemType('Publication', VIEW_MODE_ELEMENT)
@rendersItemType(DEFAULT_ITEM_TYPE, VIEW_MODE_ELEMENT)
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
