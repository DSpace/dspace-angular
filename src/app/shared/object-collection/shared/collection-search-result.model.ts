import { SearchResult } from '../../../+search-page/search-result.model';
import { Collection } from '../../../core/shared/collection.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

@searchResultFor(Collection)
export class CollectionSearchResult extends SearchResult<Collection> {
}
