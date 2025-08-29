import {
  Observable,
  of,
} from 'rxjs';

import { CacheableObject } from '../cache/cacheable-object.model';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';

/**
 * Stub class for {@link BaseDataService}
 */
export abstract class BaseDataServiceStub<T extends CacheableObject> {

  findByHref(_href$: string | Observable<string>, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    return createSuccessfulRemoteDataObject$(undefined);
  }

  invalidateByHref(_href: string): Observable<boolean> {
    return of(true);
  }

}
