import { Component } from '@angular/core';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { focusShadow } from '../../../../../shared/animations/focus';

@listableObjectComponent('JournalVolumeSearchResult', ViewMode.GridElement)
@Component({
  selector: 'ds-journal-volume-search-result-grid-element',
  styleUrls: ['./journal-volume-search-result-grid-element.component.scss'],
  templateUrl: './journal-volume-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item search result of the type Journal Volume
 */
export class JournalVolumeSearchResultGridElementComponent extends SearchResultGridElementComponent<ItemSearchResult, Item> {
}
