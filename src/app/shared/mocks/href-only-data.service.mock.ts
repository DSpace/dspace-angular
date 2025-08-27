import { Observable } from 'rxjs';

import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../remote-data.utils';
import { createPaginatedList } from '../testing/utils.test';

export function getMockHrefOnlyDataService(
  findByHref$: Observable<RemoteData<any>> = createNoContentRemoteDataObject$(),
  findListByHref$: Observable<RemoteData<PaginatedList<any>>> = createSuccessfulRemoteDataObject$(createPaginatedList([])),
) {
  return jasmine.createSpyObj('hrefOnlyDataService', {
    findByHref: findByHref$,
    findListByHref: findListByHref$,
  });
}
