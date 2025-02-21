import { Observable } from 'rxjs';

import { PaginatedList } from '../data';
import { RemoteData } from '../data';
import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../utilities';
import { createPaginatedList } from '../utilities';

export function getMockHrefOnlyDataService(
  findByHref$: Observable<RemoteData<any>> = createNoContentRemoteDataObject$(),
  findListByHref$: Observable<RemoteData<PaginatedList<any>>> = createSuccessfulRemoteDataObject$(createPaginatedList([])),
) {
  return jasmine.createSpyObj('hrefOnlyDataService', {
    findByHref: findByHref$,
    findListByHref: findListByHref$,
  });
}
