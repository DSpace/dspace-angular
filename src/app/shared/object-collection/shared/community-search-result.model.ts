import { Community } from '../../../core/shared/community.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

@searchResultFor(Community)
export class CommunitySearchResult extends SearchResult<Community> {
}
