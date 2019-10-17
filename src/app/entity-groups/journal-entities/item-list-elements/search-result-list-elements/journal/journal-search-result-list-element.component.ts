import { Component } from '@angular/core';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';

@listableObjectComponent('JournalSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-journal-search-result-list-element',
  styleUrls: ['./journal-search-result-list-element.component.scss'],
  templateUrl: './journal-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Journal
 */
export class JournalSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
}
