import { searchResultFor } from '../../../shared/search/search-result-element-decorator';
import { Collection } from '../collection.model';
import { SearchResult } from '../search/models/search-result.model';

@searchResultFor(Collection)
export class CollectionSearchResult extends SearchResult<Collection> {
}
