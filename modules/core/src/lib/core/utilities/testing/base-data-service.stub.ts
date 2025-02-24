import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { CacheableObject } from '../../cache/cacheable-object.model';
import { FollowLinkConfig } from '../../data/follow-link-config.model';
import { RemoteData } from '../../data/remote-data';
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
