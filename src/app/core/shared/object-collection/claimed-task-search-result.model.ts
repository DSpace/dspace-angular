import { searchResultFor } from '../../../shared/search/search-result-element-decorator';
import { ClaimedTask } from '../../tasks/models/claimed-task-object.model';
import { SearchResult } from '../search/models/search-result.model';

/**
 * Represents a search result object of a ClaimedTask object
 */
@searchResultFor(ClaimedTask)
export class ClaimedTaskSearchResult extends SearchResult<ClaimedTask> {
}
