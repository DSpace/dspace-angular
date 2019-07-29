import { SearchResult } from '../../search/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { searchResultFor } from '../../search/search-result-element-decorator';
import { inheritEquatable } from '../../../core/utilities/equals.decorators';

@searchResultFor(Item)
@inheritEquatable(SearchResult)
export class ItemSearchResult extends SearchResult<Item> {
}
