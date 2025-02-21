import { SearchResult } from '../shared';
import { ClaimedTask } from '../tasks';

/**
 * Represents a search result object of a Declined/Rejected ClaimedTask object (sent back to the submitter)
 */
export class ClaimedDeclinedTaskSearchResult extends SearchResult<ClaimedTask> {
}
