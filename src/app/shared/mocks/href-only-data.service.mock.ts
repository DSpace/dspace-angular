import { Observable } from 'rxjs';

import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../../modules/shared/utils/src/lib/utils/remote-data.utils';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
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
