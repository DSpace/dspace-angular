import { Observable } from 'rxjs';

import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../utilities/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';

export function getMockHrefOnlyDataService(
  findByHref$: Observable<RemoteData<any>> = createNoContentRemoteDataObject$(),
  findListByHref$: Observable<RemoteData<PaginatedList<any>>> = createSuccessfulRemoteDataObject$(createPaginatedList([])),
) {
  return jasmine.createSpyObj('hrefOnlyDataService', {
    findByHref: findByHref$,
    findListByHref: findListByHref$,
  });
}
