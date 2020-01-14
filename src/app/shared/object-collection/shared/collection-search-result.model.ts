import { SearchResult } from '../../search/search-result.model';
import { Collection } from '../../../core/shared/collection.model';
import { searchResultFor } from '../../search/search-result-element-decorator';

@searchResultFor(Collection)
export class CollectionSearchResult extends SearchResult<Collection> {
}
