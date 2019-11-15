import { ClaimedTask } from '../../../core/tasks/models/claimed-task-object.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

/**
 * Represents a search result object of a ClaimedTask object
 */
@searchResultFor(ClaimedTask)
export class ClaimedTaskSearchResult extends SearchResult<ClaimedTask> {
}
