import { TypedItemSearchResultGridElementComponent } from '../typed-item-search-result-grid-element.component';
import { DEFAULT_ITEM_TYPE, rendersItemType } from '../../../../items/item-type-decorator';
import { Component } from '@angular/core';
import { focusShadow } from '../../../../animations/focus';
import { ViewMode } from '../../../../../core/shared/view-mode.model';

@rendersItemType('Publication', ViewMode.GridElement)
@rendersItemType(DEFAULT_ITEM_TYPE, ViewMode.GridElement)
@Component({
  selector: 'ds-publication-grid-element',
  styleUrls: ['./publication-grid-element.component.scss'],
  templateUrl: './publication-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item of the type Publication
 */
export class PublicationGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
