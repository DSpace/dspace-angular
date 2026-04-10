import { Observable } from 'rxjs';

import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import { ItemType } from '../shared/item-relationships/item-type.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';
import { createPaginatedList } from './utils.test';

/**
 * Stub class of {@link EntityTypeDataService}
 */
export class EntityTypeDataServiceStub {

  public findAll(_options?: FindListOptions, _useCachedVersionIfAvailable?: boolean, _reRequestOnStale?: boolean, ..._linksToFollow: FollowLinkConfig<ItemType>[]): Observable<RemoteData<PaginatedList<ItemType>>> {
    return createSuccessfulRemoteDataObject$(createPaginatedList());
  }

}
