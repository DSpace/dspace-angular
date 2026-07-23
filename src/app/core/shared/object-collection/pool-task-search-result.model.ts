import { searchResultFor } from '../../../shared/search/search-result-element-decorator';
import { PoolTask } from '../../tasks/models/pool-task-object.model';
import { SearchResult } from '../search/models/search-result.model';

/**
 * Represents a search result object of a PoolTask object
 */
@searchResultFor(PoolTask)
export class PoolTaskSearchResult extends SearchResult<PoolTask> {
}
