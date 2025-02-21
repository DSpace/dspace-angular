import {
  EMPTY,
  Observable,
} from 'rxjs';

import { CacheableObject } from '../../cache';
import { FollowLinkConfig } from '../../data';
import { RemoteData } from '../../data';
import { BaseDataServiceStub } from './base-data-service.stub';

/**
 * Stub class for {@link IdentifiableDataService}
 */
export class IdentifiableDataServiceStub<T extends CacheableObject> extends BaseDataServiceStub<T> {

  findById(_id: string, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    return EMPTY;
  }

}
