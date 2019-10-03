import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { focusShadow } from '../../../../../shared/animations/focus';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../../core/shared/item.model';

@listableObjectComponent('OrgUnitSearchResult', ViewMode.GridElement)
@Component({
  selector: 'ds-orgunit-search-result-grid-element',
  styleUrls: ['./orgunit-search-result-grid-element.component.scss'],
  templateUrl: './orgunit-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item of the type Organisation Unit
 */
export class OrgunitSearchResultGridElementComponent extends SearchResultGridElementComponent<ItemSearchResult, Item> {
}
