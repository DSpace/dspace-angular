import { Component } from '@angular/core';

import { listElementFor } from '../../list-element-decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Item } from '../../../core/shared/item.model';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';

@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
  templateUrl: 'item-search-result-list-element.component.html'
})

@listElementFor(ItemSearchResult)
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {}
