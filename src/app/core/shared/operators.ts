import { Router, UrlTree } from '@angular/router';
import { Observable, combineLatest as observableCombineLatest } from 'rxjs';
import { filter, find, flatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { hasValue, hasValueOperator, isNotEmpty } from '../../shared/empty.util';
import { SearchResult } from '../../shared/search/search-result.model';
import { DSOSuccessResponse, RestResponse } from '../cache/response.models';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { RestRequest } from '../data/request.models';
import { RequestEntry } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import { MetadataField } from '../metadata/metadata-field.model';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { BrowseDefinition } from './browse-definition.model';
import { DSpaceObject } from './dspace-object.model';
import { getUnauthorizedRoute } from '../../app-routing-paths';
import { getEndUserAgreementPath } from '../../info/info-routing.module';

/**
 * This file contains custom RxJS operators that can be used in multiple places
 */

export const getRequestFromRequestHref = (requestService: RequestService) =>
  (source: Observable<string>): Observable<RequestEntry> =>
    source.pipe(
      flatMap((href: string) => requestService.getByHref(href)),
      hasValueOperator()
    );

export const getRequestFromRequestUUID = (requestService: RequestService) =>
  (source: Observable<string>): Observable<RequestEntry> =>
    source.pipe(
      flatMap((uuid: string) => requestService.getByUUID(uuid)),
      hasValueOperator()
    );

export const filterSuccessfulResponses = () =>
  (source: Observable<RequestEntry>): Observable<RestResponse> =>
    source.pipe(
      getResponseFromEntry(),
      filter((response: RestResponse) => response.isSuccessful === true),
    );

export const getResponseFromEntry = () =>
  (source: Observable<RequestEntry>): Observable<RestResponse> =>
    source.pipe(
      filter((entry: RequestEntry) => hasValue(entry) && hasValue(entry.response)),
      map((entry: RequestEntry) => entry.response)
    );

export const getResourceLinksFromResponse = () =>
  (source: Observable<RequestEntry>): Observable<string[]> =>
    source.pipe(
      filterSuccessfulResponses(),
      map((response: DSOSuccessResponse) => response.resourceSelfLinks),
    );

export const configureRequest = (requestService: RequestService) =>
  (source: Observable<RestRequest>): Observable<RestRequest> =>
    source.pipe(tap((request: RestRequest) => requestService.configure(request)));

export const getRemoteDataPayload = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<T> =>
    source.pipe(map((remoteData: RemoteData<T>) => remoteData.payload));

export const getPaginatedListPayload = () =>
  <T>(source: Observable<PaginatedList<T>>): Observable<T[]> =>
    source.pipe(map((list: PaginatedList<T>) => list.page));

export const getSucceededRemoteData = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(filter((rd: RemoteData<T>) => rd.hasSucceeded), take(1));

export const getSucceededRemoteWithNotEmptyData = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(find((rd: RemoteData<T>) => rd.hasSucceeded && isNotEmpty(rd.payload)));

/**
 * Get the first successful remotely retrieved object
 *
 * You usually don't want to use this, it is a code smell.
 * Work with the RemoteData object instead, that way you can
 * handle loading and errors correctly.
 *
 * These operators were created as a first step in refactoring
 * out all the instances where this is used incorrectly.
 */
export const getFirstSucceededRemoteDataPayload = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<T> =>
    source.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload()
    );

/**
 * Get the first successful remotely retrieved object with not empty payload
 *
 * You usually don't want to use this, it is a code smell.
 * Work with the RemoteData object instead, that way you can
 * handle loading and errors correctly.
 *
 * These operators were created as a first step in refactoring
 * out all the instances where this is used incorrectly.
 */
export const getFirstSucceededRemoteDataWithNotEmptyPayload = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<T> =>
    source.pipe(
      getSucceededRemoteWithNotEmptyData(),
      getRemoteDataPayload()
    );

/**
 * Get the all successful remotely retrieved objects
 *
 * You usually don't want to use this, it is a code smell.
 * Work with the RemoteData object instead, that way you can
 * handle loading and errors correctly.
 *
 * These operators were created as a first step in refactoring
 * out all the instances where this is used incorrectly.
 */
export const getAllSucceededRemoteDataPayload = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<T> =>
    source.pipe(
      getAllSucceededRemoteData(),
      getRemoteDataPayload()
    );

/**
 * Get the first successful remotely retrieved paginated list
 * as an array
 *
 * You usually don't want to use this, it is a code smell.
 * Work with the RemoteData object instead, that way you can
 * handle loading and errors correctly.
 *
 * You also don't want to ignore pagination and simply use the
 * page as an array.
 *
 * These operators were created as a first step in refactoring
 * out all the instances where this is used incorrectly.
 */
export const getFirstSucceededRemoteListPayload = () =>
  <T>(source: Observable<RemoteData<PaginatedList<T>>>): Observable<T[]> =>
    source.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload()
    );

/**
 * Get all successful remotely retrieved paginated lists
 * as arrays
 *
 * You usually don't want to use this, it is a code smell.
 * Work with the RemoteData object instead, that way you can
 * handle loading and errors correctly.
 *
 * You also don't want to ignore pagination and simply use the
 * page as an array.
 *
 * These operators were created as a first step in refactoring
 * out all the instances where this is used incorrectly.
 */
export const getAllSucceededRemoteListPayload = () =>
  <T>(source: Observable<RemoteData<PaginatedList<T>>>): Observable<T[]> =>
    source.pipe(
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload()
    );

/**
 * Operator that checks if a remote data object contains a page not found error
 * When it does contain such an error, it will redirect the user to a page not found, without altering the current URL
 * @param router The router used to navigate to a new page
 */
export const redirectToPageNotFoundOn404 = (router: Router) =>
  <T>(source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(
      tap((rd: RemoteData<T>) => {
        if (rd.hasFailed && rd.error.statusCode === 404) {
          router.navigateByUrl('/404', { skipLocationChange: true });
        }
      }));

/**
 * Operator that returns a UrlTree to the unauthorized page when the boolean received is false
 * @param router
 */
export const returnUnauthorizedUrlTreeOnFalse = (router: Router) =>
  (source: Observable<boolean>): Observable<boolean | UrlTree> =>
    source.pipe(
      map((authorized: boolean) => {
        return authorized ? authorized : router.parseUrl(getUnauthorizedRoute())
      }));

/**
 * Operator that returns a UrlTree to the unauthorized page when the boolean received is false
 * @param router    Router
 * @param redirect  Redirect URL to add to the UrlTree. This is used to redirect back to the original route after the
 *                  user accepts the agreement.
 */
export const returnEndUserAgreementUrlTreeOnFalse = (router: Router, redirect: string) =>
  (source: Observable<boolean>): Observable<boolean | UrlTree> =>
    source.pipe(
      map((hasAgreed: boolean) => {
        const queryParams = { redirect: encodeURIComponent(redirect) };
        return hasAgreed ? hasAgreed : router.createUrlTree([getEndUserAgreementPath()], { queryParams });
      }));

export const getFinishedRemoteData = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(find((rd: RemoteData<T>) => !rd.isLoading));

export const getAllSucceededRemoteData = () =>
  <T>(source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(filter((rd: RemoteData<T>) => rd.hasSucceeded));

export const toDSpaceObjectListRD = () =>
  <T extends DSpaceObject>(source: Observable<RemoteData<PaginatedList<SearchResult<T>>>>): Observable<RemoteData<PaginatedList<T>>> =>
    source.pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<T>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<T>>>) => {
        const dsoPage: T[] = rd.payload.page.filter((result) => hasValue(result)).map((searchResult: SearchResult<T>) => searchResult.indexableObject);
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<T>;
        return Object.assign(rd, { payload: payload });
      })
    );

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
        .find((def: BrowseDefinition) => def.id === definitionID)
      ),
      map((def: BrowseDefinition) => {
        if (isNotEmpty(def)) {
          return def._links;
        } else {
          throw new Error(`No metadata browse definition could be found for id '${definitionID}'`);
        }
      })
    );

/**
 * Get the first occurrence of an object within a paginated list
 */
export const getFirstOccurrence = () =>
  <T extends DSpaceObject>(source: Observable<RemoteData<PaginatedList<T>>>): Observable<RemoteData<T>> =>
    source.pipe(
      map((rd) => Object.assign(rd, { payload: rd.payload.page.length > 0 ? rd.payload.page[0] : undefined }))
    );

/**
 * Operator for turning the current page of bitstreams into an array
 */
export const paginatedListToArray = () =>
  <T extends DSpaceObject>(source: Observable<RemoteData<PaginatedList<T>>>): Observable<T[]> =>
    source.pipe(
      hasValueOperator(),
      map((objectRD: RemoteData<PaginatedList<T>>) => objectRD.payload.page.filter((object: T) => hasValue(object)))
    );

/**
 * Operator for turning a list of metadata fields into an array of string representing their schema.element.qualifier string
 */
export const metadataFieldsToString = () =>
  (source: Observable<RemoteData<PaginatedList<MetadataField>>>): Observable<string[]> =>
    source.pipe(
      hasValueOperator(),
      map((fieldRD: RemoteData<PaginatedList<MetadataField>>) => {
        return fieldRD.payload.page.filter((object: MetadataField) => hasValue(object))
      }),
      switchMap((fields: MetadataField[]) => {
        const fieldSchemaArray = fields.map((field: MetadataField) => {
          return field.schema.pipe(
            getFirstSucceededRemoteDataPayload(),
            map((schema: MetadataSchema) => ({ field, schema }))
          );
        });
        return observableCombineLatest(fieldSchemaArray);
      }),
      map((fieldSchemaArray: Array<{ field: MetadataField, schema: MetadataSchema }>): string[] => {
        return fieldSchemaArray.map((fieldSchema: { field: MetadataField, schema: MetadataSchema }) => fieldSchema.schema.prefix + '.' + fieldSchema.field.toString())
      })
    );
