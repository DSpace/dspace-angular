import { searchResultFor } from '../../../shared/search/search-result-element-decorator';
import { Community } from '../community.model';
import { SearchResult } from '../search/models/search-result.model';

@searchResultFor(Community)
export class CommunitySearchResult extends SearchResult<Community> {
}
