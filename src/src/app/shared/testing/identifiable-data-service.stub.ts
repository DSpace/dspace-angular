import {
  EMPTY,
  Observable,
} from 'rxjs';

import { CacheableObject } from '../../core/cache/cacheable-object.model';
import { RemoteData } from '../../core/data/remote-data';
import { FollowLinkConfig } from '../utils/follow-link-config.model';
import { BaseDataServiceStub } from './base-data-service.stub';

/**
 * Stub class for {@link IdentifiableDataService}
 */
export class IdentifiableDataServiceStub<T extends CacheableObject> extends BaseDataServiceStub<T> {

  findById(_id: string, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    return EMPTY;
  }

}
