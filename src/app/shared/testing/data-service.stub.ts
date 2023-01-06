import { FollowLinkConfig } from '../utils/follow-link-config.model';
import { Observable, EMPTY } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { CacheableObject } from '../../core/cache/object-cache.reducer';

export abstract class DataServiceStub<T extends CacheableObject> {

  findById(_id: string, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    return EMPTY;
  }

}
