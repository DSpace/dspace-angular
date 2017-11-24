import { Component } from '@angular/core';

import { listElementFor } from '../../list-element-decorator';
import { ItemSearchResult } from './item-search-result.model';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Item } from '../../../core/shared/item.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
  templateUrl: 'item-search-result-list-element.component.html',
})

@listElementFor(ItemSearchResult)
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
  lines = Observable.of(3);
}
