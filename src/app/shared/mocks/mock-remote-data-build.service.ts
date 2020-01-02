import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { RemoteData } from '../../core/data/remote-data';
import { RequestEntry } from '../../core/data/request.reducer';
import { hasValue } from '../empty.util';
import { NormalizedObject } from '../../core/cache/models/normalized-object.model';
import { createSuccessfulRemoteDataObject$ } from '../testing/utils';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';

export function getMockRemoteDataBuildService(toRemoteDataObservable$?: Observable<RemoteData<any>>, buildList$?: Observable<RemoteData<PaginatedList<any>>>): RemoteDataBuildService {
  return {
    toRemoteDataObservable: (requestEntry$: Observable<RequestEntry>, payload$: Observable<any>) => {

      if (hasValue(toRemoteDataObservable$)) {
        return toRemoteDataObservable$;
      } else {
        return payload$.pipe(map((payload) => ({
          payload
        } as RemoteData<any>)))
      }
    },
    buildSingle: (href$: string | Observable<string>) => createSuccessfulRemoteDataObject$({}),
    build: (normalized: NormalizedObject<any>) => Object.create({}),
    buildList: (href$: string | Observable<string>) => {
      if (hasValue(buildList$)) {
        return buildList$;
      } else {
        return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
      }
    }
  } as RemoteDataBuildService;

}
