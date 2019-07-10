import { SearchResult } from '../../search/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { searchResultFor } from '../../search/search-result-element-decorator';

@searchResultFor(Item)
export class ItemSearchResult extends SearchResult<Item> {
}
