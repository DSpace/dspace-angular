import { Workflowitem } from '../../../core/submission/models/workflowitem.model';
import { SearchResult } from '../../../+search-page/search-result.model';
import { MyDSpaceConfigurationType } from '../../../+my-dspace-page/mydspace-configuration-type';
import { searchResultFor } from '../../../+search-page/search-service/search-result-element-decorator';

@searchResultFor(Workflowitem, MyDSpaceConfigurationType.Workspace)
export class WorkflowitemMyDSpaceResult extends SearchResult<Workflowitem> {
}
