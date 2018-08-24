import { Observable } from 'rxjs';
import { filter, first, flatMap, map, tap } from 'rxjs/operators';
import { hasValueOperator } from '../../shared/empty.util';
import { DSOSuccessResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RemoteData } from '../data/remote-data';
import { RestRequest } from '../data/request.models';
import { RequestEntry } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import { DSpaceObject } from './dspace-object.model';
import { PaginatedList } from '../data/paginated-list';
import { SearchResult } from '../../+search-page/search-result.model';

/**
 * This file contains custom RxJS operators that can be used in multiple places
 */

export const getRequestFromSelflink = (requestService: RequestService) =>
  (source: Observable<string>): Observable<RequestEntry> =>
    source.pipe(
      flatMap((href: string) => requestService.getByHref(href)),
      hasValueOperator()
    );

export const getResponseFromSelflink = (responseCache: ResponseCacheService) =>
  (source: Observable<string>): Observable<ResponseCacheEntry> =>
    source.pipe(
      flatMap((href: string) => responseCache.get(href)),
      hasValueOperator()
    );

export const filterSuccessfulResponses = () =>
  (source: Observable<ResponseCacheEntry>): Observable<ResponseCacheEntry> =>
    source.pipe(filter((entry: ResponseCacheEntry) => entry.response.isSuccessful === true));

export const getResourceLinksFromResponse = () =>
  (source: Observable<ResponseCacheEntry>): Observable<string[]> =>
    source.pipe(
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => (entry.response as DSOSuccessResponse).resourceSelfLinks),
    );

export const configureRequest = (requestService: RequestService) =>
  (source: Observable<RestRequest>): Observable<RestRequest> =>
    source.pipe(tap((request: RestRequest) => requestService.configure(request)));

export const getRemoteDataPayload = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<T> =>
    source.pipe(map((remoteData: RemoteData<T>) => remoteData.payload));

export const getSucceededRemoteData = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(first((rd: RemoteData<T>) => rd.hasSucceeded));

export const toDSpaceObjectListRD = () =>
  <T extends DSpaceObject>(source: Observable<RemoteData<PaginatedList<SearchResult<T>>>>): Observable<RemoteData<PaginatedList<T>>> =>
    source.pipe(
      map((rd: RemoteData<PaginatedList<SearchResult<T>>>) => {
        const dsoPage: T[] = rd.payload.page.map((searchResult: SearchResult<T>) => searchResult.dspaceObject);
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<T>;
        return Object.assign(rd, {payload: payload});
      })
    );
