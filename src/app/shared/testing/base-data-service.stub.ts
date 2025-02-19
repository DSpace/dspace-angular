import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { createSuccessfulRemoteDataObject$ } from '../../../../modules/shared/utils/src/lib/utils/remote-data.utils';
import { CacheableObject } from '../../core/cache/cacheable-object.model';
import { FollowLinkConfig } from '../../core/data/follow-link-config.model';
import { RemoteData } from '../../core/data/remote-data';

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
