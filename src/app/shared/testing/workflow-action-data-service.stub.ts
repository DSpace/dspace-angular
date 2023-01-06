import { FindListOptions } from '../../core/data/request.models';
import { FollowLinkConfig } from '../utils/follow-link-config.model';
import { WorkspaceItem } from '../../core/submission/models/workspaceitem.model';
import { Observable, EMPTY } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { DataServiceStub } from './data-service.stub';

export class WorkflowActionDataServiceStub extends DataServiceStub<WorkflowItem> {

  public findByItem(_uuid: string, _useCachedVersionIfAvailable = false, _reRequestOnStale = true, _options: FindListOptions = {}, ..._linksToFollow: FollowLinkConfig<WorkspaceItem>[]): Observable<RemoteData<WorkspaceItem>> {
    return EMPTY;
  }

}
