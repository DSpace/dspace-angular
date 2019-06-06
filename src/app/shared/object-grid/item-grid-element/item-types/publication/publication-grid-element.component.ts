import { TypedItemSearchResultGridElementComponent } from '../typed-item-search-result-grid-element.component';
import { DEFAULT_ITEM_TYPE, ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { Component } from '@angular/core';
import { focusShadow } from '../../../../animations/focus';

@rendersItemType('Publication', ItemViewMode.Card)
@rendersItemType(DEFAULT_ITEM_TYPE, ItemViewMode.Card)
@Component({
  selector: 'ds-publication-grid-element',
  styleUrls: ['./publication-grid-element.component.scss'],
  templateUrl: './publication-grid-element.component.html',
  animations: [focusShadow]
})
export class PublicationGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
