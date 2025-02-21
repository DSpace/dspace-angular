import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { CacheableObject } from '../../cache';
import { FollowLinkConfig } from '../../data';
import { RemoteData } from '../../data';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';

/**
 * Stub class for {@link BaseDataService}
 */
export abstract class BaseDataServiceStub<T extends CacheableObject> {

  findByHref(_href$: string | Observable<string>, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    return createSuccessfulRemoteDataObject$(undefined);
  }

  invalidateByHref(_href: string): Observable<boolean> {
    return observableOf(true);
  }

}
