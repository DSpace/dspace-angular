import { PoolTask } from '../../../core/tasks/models/pool-task-object.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { MyDSpaceConfigurationType } from '../../../+my-dspace-page/mydspace-configuration-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

@searchResultFor(PoolTask, MyDSpaceConfigurationType.Workflow)
export class PoolTaskMyDSpaceResult extends SearchResult<PoolTask> {
}
