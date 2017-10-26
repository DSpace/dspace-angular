import { Component } from '@angular/core';

import { gridElementFor } from '../../grid-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { Item } from '../../../core/shared/item.model';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';

@Component({
  selector: 'ds-item-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'item-search-result-grid-element.component.scss'],
  templateUrl: 'item-search-result-grid-element.component.html'
})

@gridElementFor(ItemSearchResult)
export class ItemSearchResultGridElementComponent extends SearchResultGridElementComponent<ItemSearchResult, Item> {}
