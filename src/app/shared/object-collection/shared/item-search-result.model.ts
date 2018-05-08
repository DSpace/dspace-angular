import { SearchResult } from '../../../+search-page/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

@searchResultFor(Item)
export class ItemSearchResult extends SearchResult<Item> {
}
