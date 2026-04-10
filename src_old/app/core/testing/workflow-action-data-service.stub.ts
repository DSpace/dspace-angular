import {
  EMPTY,
  Observable,
} from 'rxjs';

import { FindListOptions } from '../data/find-list-options.model';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import { WorkflowItem } from '../submission/models/workflowitem.model';
import { WorkspaceItem } from '../submission/models/workspaceitem.model';
import { IdentifiableDataServiceStub } from './identifiable-data-service.stub';

/**
 * Stub class for {@link WorkflowActionDataService}
 */
export class WorkflowActionDataServiceStub extends IdentifiableDataServiceStub<WorkflowItem> {

  public findByItem(_uuid: string, _useCachedVersionIfAvailable = false, _reRequestOnStale = true, _options: FindListOptions = {}, ..._linksToFollow: FollowLinkConfig<WorkspaceItem>[]): Observable<RemoteData<WorkspaceItem>> {
    return EMPTY;
  }

}
