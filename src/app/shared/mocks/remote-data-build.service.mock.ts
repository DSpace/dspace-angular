import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { RequestEntry } from '../../core/data/request.reducer';
import { PageInfo } from '../../core/shared/page-info.model';
import { hasValue } from '../empty.util';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';

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
    buildList: (href$: string | Observable<string>) => {
      if (hasValue(buildList$)) {
        return buildList$;
      } else {
        return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
      }
    }
  } as RemoteDataBuildService;

}

export function getMockRemoteDataBuildServiceHrefMap(toRemoteDataObservable$?: Observable<RemoteData<any>>, buildListHrefMap$?: { [href: string]: Observable<RemoteData<PaginatedList<any>>>; }): RemoteDataBuildService {
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
    buildList: (href$: string | Observable<string>) => {
      if (typeof href$ === 'string') {
        if (hasValue(buildListHrefMap$[href$])) {
          return buildListHrefMap$[href$];
        } else {
          return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
        }
      }
      href$.pipe(
        map((href: string) => {
          if (hasValue(buildListHrefMap$[href])) {
            return buildListHrefMap$[href];
          } else {
            return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
          }
        })
      );
    }
  } as RemoteDataBuildService;

}
