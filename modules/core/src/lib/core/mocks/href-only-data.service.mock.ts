import { Observable } from 'rxjs';

import {
  PaginatedList,
  RemoteData,
} from '../data';
import {
  createNoContentRemoteDataObject$,
  createPaginatedList,
  createSuccessfulRemoteDataObject$,
} from '../utilities';

export function getMockHrefOnlyDataService(
  findByHref$: Observable<RemoteData<any>> = createNoContentRemoteDataObject$(),
  findListByHref$: Observable<RemoteData<PaginatedList<any>>> = createSuccessfulRemoteDataObject$(createPaginatedList([])),
) {
  return jasmine.createSpyObj('hrefOnlyDataService', {
    findByHref: findByHref$,
    findListByHref: findListByHref$,
  });
}
