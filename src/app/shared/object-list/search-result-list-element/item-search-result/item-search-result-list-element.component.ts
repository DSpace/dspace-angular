import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Item } from '../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { ViewMode } from '../../../../+search-page/search-options.model';

@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
  templateUrl: 'item-search-result-list-element.component.html'
})

@renderElementsFor(ItemSearchResult, ViewMode.List)
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {}
