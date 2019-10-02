import { Component } from '@angular/core';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { DEFAULT_ITEM_TYPE, listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent('Publication', ViewMode.ListElement)
@listableObjectComponent(DEFAULT_ITEM_TYPE, ViewMode.ListElement)
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
