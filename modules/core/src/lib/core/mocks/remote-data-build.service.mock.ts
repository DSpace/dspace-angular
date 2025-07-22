import { hasValue } from '@dspace/shared/utils';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../cache';
import {
  buildPaginatedList,
  PaginatedList,
  RemoteData,
  RequestEntry,
} from '../data';
import { PageInfo } from '../shared';
import { createSuccessfulRemoteDataObject$ } from '../utilities';

export function getMockRemoteDataBuildService(toRemoteDataObservable$?: Observable<RemoteData<any>>, buildList$?: Observable<RemoteData<PaginatedList<any>>>): RemoteDataBuildService {
  return {
    toRemoteDataObservable: (requestEntry$: Observable<RequestEntry>, payload$: Observable<any>) => {

      if (hasValue(toRemoteDataObservable$)) {
        return toRemoteDataObservable$;
      } else {
        return payload$.pipe(map((payload) => ({
          payload,
        } as RemoteData<any>)));
      }
    },
    buildSingle: (href$: string | Observable<string>) => createSuccessfulRemoteDataObject$({}),
    buildList: (href$: string | Observable<string>) => {
      if (hasValue(buildList$)) {
        return buildList$;
      } else {
        return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []));
      }
    },
    buildFromRequestUUID: (id: string) => createSuccessfulRemoteDataObject$({}),
    buildFromRequestUUIDAndAwait: (id: string, callback: (rd?: RemoteData<any>) => Observable<any>) => createSuccessfulRemoteDataObject$({}),
    buildFromHref: (href: string) => createSuccessfulRemoteDataObject$({}),
  } as RemoteDataBuildService;

}

export function getMockRemoteDataBuildServiceHrefMap(toRemoteDataObservable$?: Observable<RemoteData<any>>, buildListHrefMap$?: { [href: string]: Observable<RemoteData<PaginatedList<any>>>; }): RemoteDataBuildService {
  return {
    toRemoteDataObservable: (requestEntry$: Observable<RequestEntry>, payload$: Observable<any>) => {

      if (hasValue(toRemoteDataObservable$)) {
        return toRemoteDataObservable$;
      } else {
        return payload$.pipe(map((payload) => ({
          payload,
        } as RemoteData<any>)));
      }
    },
    buildSingle: (href$: string | Observable<string>) => createSuccessfulRemoteDataObject$({}),
    buildList: (href$: string | Observable<string>) => {
      if (typeof href$ === 'string') {
        if (hasValue(buildListHrefMap$[href$])) {
          return buildListHrefMap$[href$];
        } else {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []));
        }
      }
      return href$.pipe(
        switchMap((href: string) => {
          if (hasValue(buildListHrefMap$[href])) {
            return buildListHrefMap$[href];
          } else {
            return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []));
          }
        }),
      );
    },
    buildFromRequestUUID: (id: string) => createSuccessfulRemoteDataObject$({}),
    buildFromRequestUUIDAndAwait: (id: string, callback: (rd?: RemoteData<any>) => Observable<any>) => createSuccessfulRemoteDataObject$({}),
    buildFromHref: (href: string) => createSuccessfulRemoteDataObject$({}),
  } as RemoteDataBuildService;

}
