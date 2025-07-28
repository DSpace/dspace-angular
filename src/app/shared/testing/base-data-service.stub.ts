import { CacheableObject } from '@core/cache/cacheable-object.model';
import { RemoteData } from '@core/data/remote-data';
import { FollowLinkConfig } from '@core/shared/follow-link-config.model';
import { createSuccessfulRemoteDataObject$ } from '@core/utilities/remote-data.utils';
import {
  Observable,
  of,
} from 'rxjs';

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
