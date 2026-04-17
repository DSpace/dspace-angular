import { Observable } from 'rxjs';

import { FindListOptions } from '../../core/data/find-list-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { ItemType } from '../../core/shared/item-relationships/item-type.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { FollowLinkConfig } from '../utils/follow-link-config.model';
import { createPaginatedList } from './utils.test';

/**
 * Stub class of {@link EntityTypeDataService}
 */
export class EntityTypeDataServiceStub {

  public findAll(_options?: FindListOptions, _useCachedVersionIfAvailable?: boolean, _reRequestOnStale?: boolean, ..._linksToFollow: FollowLinkConfig<ItemType>[]): Observable<RemoteData<PaginatedList<ItemType>>> {
    return createSuccessfulRemoteDataObject$(createPaginatedList());
  }

}
