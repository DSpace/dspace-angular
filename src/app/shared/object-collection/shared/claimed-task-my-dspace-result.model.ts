import { ClaimedTask } from '../../../core/tasks/models/claimed-task-object.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { MyDSpaceConfigurationType } from '../../../+my-dspace-page/mydspace-configuration-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

@searchResultFor(ClaimedTask, MyDSpaceConfigurationType.Workflow)
export class ClaimedTaskMyDSpaceResult extends SearchResult<ClaimedTask> {
}
