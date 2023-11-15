import { Component } from '@angular/core';
import { Context } from '../../../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../../../app/core/shared/view-mode.model';
import { focusShadow } from '../../../../../../../../app/shared/animations/focus';
import { ItemSearchResult } from '../../../../../../../../app/shared/object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultGridElementComponent as BaseComponent } from '../../../../../../../../app/shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.GridElement, Context.Any, 'image-gallery')
@listableObjectComponent(ItemSearchResult, ViewMode.GridElement, Context.Any, 'image-gallery')
@Component({
  selector: 'ds-item-search-result-grid-element-custom',
  styleUrls: ['./item-search-result-grid-element.component.scss'],
  templateUrl: './item-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item search result of the type Publication
 */
export class ItemSearchResultGridElementComponent extends BaseComponent {

}
