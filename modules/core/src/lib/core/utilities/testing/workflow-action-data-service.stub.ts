import {
  EMPTY,
  Observable,
} from 'rxjs';

import { FindListOptions } from '../../data';
import { FollowLinkConfig } from '../../data';
import { RemoteData } from '../../data';
import { WorkflowItem } from '@dspace/core';
import { WorkspaceItem } from '@dspace/core';
import { IdentifiableDataServiceStub } from './identifiable-data-service.stub';

/**
 * Stub class for {@link WorkflowActionDataService}
 */
export class WorkflowActionDataServiceStub extends IdentifiableDataServiceStub<WorkflowItem> {

  public findByItem(_uuid: string, _useCachedVersionIfAvailable = false, _reRequestOnStale = true, _options: FindListOptions = {}, ..._linksToFollow: FollowLinkConfig<WorkspaceItem>[]): Observable<RemoteData<WorkspaceItem>> {
    return EMPTY;
  }

}
