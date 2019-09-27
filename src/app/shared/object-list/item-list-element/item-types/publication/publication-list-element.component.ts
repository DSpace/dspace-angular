import { Component } from '@angular/core';
import { DEFAULT_ITEM_TYPE, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { ViewMode } from '../../../../../core/shared/view-mode.model';

@rendersItemType('Publication', ViewMode.ListElement)
@rendersItemType(DEFAULT_ITEM_TYPE, ViewMode.ListElement)
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
