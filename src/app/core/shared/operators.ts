import { Observable } from 'rxjs/Observable';
import { filter, flatMap, map, tap } from 'rxjs/operators';
import { hasValueOperator, isNotEmpty } from '../../shared/empty.util';
import { DSOSuccessResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RemoteData } from '../data/remote-data';
import { RestRequest } from '../data/request.models';
import { RequestEntry } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from './browse-definition.model';

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

/**
 * Get the browse links from a definition by ID given an array of all definitions
 * @param {string} definitionID
 * @returns {(source: Observable<RemoteData<BrowseDefinition[]>>) => Observable<any>}
 */
export const getBrowseDefinitionLinks = (definitionID: string) =>
  (source: Observable<RemoteData<BrowseDefinition[]>>): Observable<any> =>
    source.pipe(
      getRemoteDataPayload(),
      map((browseDefinitions: BrowseDefinition[]) => browseDefinitions
        .find((def: BrowseDefinition) => def.id === definitionID && def.metadataBrowse === true)
      ),
      map((def: BrowseDefinition) => {
        if (isNotEmpty(def)) {
          return def._links;
        } else {
          throw new Error(`No metadata browse definition could be found for id '${definitionID}'`);
        }
      })
    );
