import { Router, UrlTree } from '@angular/router';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  filter,
  find,
  map,
  mergeMap,
  switchMap,
  take,
  takeWhile,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { hasNoValue, hasValue, hasValueOperator, isNotEmpty } from '../../shared/empty.util';
import { SearchResult } from '../../shared/search/search-result.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RestRequest } from '../data/request.models';
import { RequestEntry, ResponseState } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import { MetadataField } from '../metadata/metadata-field.model';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { BrowseDefinition } from './browse-definition.model';
import { DSpaceObject } from './dspace-object.model';
import { getForbiddenRoute, getPageNotFoundRoute } from '../../app-routing-paths';
import { getEndUserAgreementPath } from '../../info/info-routing-paths';
import { AuthService } from '../auth/auth.service';
import { InjectionToken } from '@angular/core';

export const DEBOUNCE_TIME_OPERATOR = new InjectionToken<<T>(dueTime: number) => (source: Observable<T>) => Observable<T>>('debounceTime', {
  providedIn: 'root',
  factory: () => debounceTime
});

export const REDIRECT_ON_4XX = new InjectionToken<<T>(router: Router, authService: AuthService) => (source: Observable<RemoteData<T>>) => Observable<RemoteData<T>>>('redirectOn4xx', {
  providedIn: 'root',
  factory: () => redirectOn4xx
});

/**
 * This file contains custom RxJS operators that can be used in multiple places
 */

export const getRequestFromRequestHref = (requestService: RequestService) =>
  (source: Observable<string>): Observable<RequestEntry> =>
    source.pipe(
      mergeMap((href: string) => requestService.getByHref(href)),
      hasValueOperator()
    );

export const getRequestFromRequestUUID = (requestService: RequestService) =>
  (source: Observable<string>): Observable<RequestEntry> =>
    source.pipe(
      mergeMap((uuid: string) => requestService.getByUUID(uuid)),
      hasValueOperator()
    );

export const getResponseFromEntry = () =>
  (source: Observable<RequestEntry>): Observable<ResponseState> =>
    source.pipe(
      filter((entry: RequestEntry) => hasValue(entry) && hasValue(entry.response)),
      map((entry: RequestEntry) => entry.response)
    );

export const sendRequest = (requestService: RequestService) =>
  (source: Observable<RestRequest>): Observable<RestRequest> =>
    source.pipe(tap((request: RestRequest) => requestService.send(request)));

export const getRemoteDataPayload = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<T> =>
    source.pipe(map((remoteData: RemoteData<T>) => remoteData.payload));

export const getPaginatedListPayload = <T>() =>
  (source: Observable<PaginatedList<T>>): Observable<T[]> =>
    source.pipe(map((list: PaginatedList<T>) => list.page));

export const getAllCompletedRemoteData = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(filter((rd: RemoteData<T>) => hasValue(rd) && rd.hasCompleted));

export const getFirstCompletedRemoteData = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(getAllCompletedRemoteData(), take(1));

export const takeUntilCompletedRemoteData = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(takeWhile((rd: RemoteData<T>) => hasNoValue(rd) || rd.isLoading, true));

export const getFirstSucceededRemoteData = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(filter((rd: RemoteData<T>) => rd.hasSucceeded), take(1));

export const getFirstSucceededRemoteWithNotEmptyData = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
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
export const getFirstSucceededRemoteDataPayload = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<T> =>
    source.pipe(
      getFirstSucceededRemoteData(),
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
export const getFirstSucceededRemoteDataWithNotEmptyPayload = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<T> =>
    source.pipe(
      getFirstSucceededRemoteWithNotEmptyData(),
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
export const getAllSucceededRemoteDataPayload = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<T> =>
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
export const getFirstSucceededRemoteListPayload = <T>() =>
  (source: Observable<RemoteData<PaginatedList<T>>>): Observable<T[]> =>
    source.pipe(
      getFirstSucceededRemoteData(),
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
export const getAllSucceededRemoteListPayload = <T>() =>
  (source: Observable<RemoteData<PaginatedList<T>>>): Observable<T[]> =>
    source.pipe(
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload()
    );

/**
 * Operator that checks if a remote data object returned a 4xx error
 * When it does contain such an error, it will redirect the user to the related error page, without
 * altering the current URL
 *
 * @param router The router used to navigate to a new page
 * @param authService Service to check if the user is authenticated
 */
export const redirectOn4xx = <T>(router: Router, authService: AuthService) =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(
      withLatestFrom(authService.isAuthenticated()),
      filter(([rd, isAuthenticated]: [RemoteData<T>, boolean]) => {
        if (rd.hasFailed) {
          if (rd.statusCode === 404 || rd.statusCode === 422) {
            router.navigateByUrl(getPageNotFoundRoute(), { skipLocationChange: true });
            return false;
          } else if (rd.statusCode === 403 || rd.statusCode === 401) {
            if (isAuthenticated) {
              router.navigateByUrl(getForbiddenRoute(), { skipLocationChange: true });
              return false;
            } else {
              authService.setRedirectUrl(router.url);
              router.navigateByUrl('login');
              return false;
            }
          }
        }
        return true;
      }),
      map(([rd,]: [RemoteData<T>, boolean]) => rd)
    );

/**
 * Operator that returns a UrlTree to a forbidden page or the login page when the boolean received is false
 * @param router      The router used to navigate to a forbidden page
 * @param authService The AuthService used to determine whether or not the user is logged in
 * @param redirectUrl The URL to redirect back to after logging in
 */
export const returnForbiddenUrlTreeOrLoginOnFalse = (router: Router, authService: AuthService, redirectUrl: string) =>
  (source: Observable<boolean>): Observable<boolean | UrlTree> =>
    source.pipe(
      map((authorized) => [authorized]),
      returnForbiddenUrlTreeOrLoginOnAllFalse(router, authService, redirectUrl),
    );

/**
 * Operator that returns a UrlTree to a forbidden page or the login page when the booleans received are all false
 * @param router      The router used to navigate to a forbidden page
 * @param authService The AuthService used to determine whether or not the user is logged in
 * @param redirectUrl The URL to redirect back to after logging in
 */
export const returnForbiddenUrlTreeOrLoginOnAllFalse = (router: Router, authService: AuthService, redirectUrl: string) =>
  (source: Observable<boolean[]>): Observable<boolean | UrlTree> =>
    observableCombineLatest(source, authService.isAuthenticated()).pipe(
      map(([authorizedList, authenticated]: [boolean[], boolean]) => {
        if (authorizedList.some((b: boolean) => b === true)) {
          return true;
        } else {
          if (authenticated) {
            return router.parseUrl(getForbiddenRoute());
          } else {
            authService.setRedirectUrl(redirectUrl);
            return router.parseUrl('login');
          }
        }
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

export const getFinishedRemoteData = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(find((rd: RemoteData<T>) => !rd.isLoading));

export const getAllSucceededRemoteData = <T>() =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(filter((rd: RemoteData<T>) => rd.hasSucceeded));

export const toDSpaceObjectListRD = <T extends DSpaceObject>() =>
  (source: Observable<RemoteData<PaginatedList<SearchResult<T>>>>): Observable<RemoteData<PaginatedList<T>>> =>
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
  (source: Observable<RemoteData<PaginatedList<BrowseDefinition>>>): Observable<any> =>
    source.pipe(
      getRemoteDataPayload(),
      getPaginatedListPayload(),
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
        return fieldRD.payload.page.filter((object: MetadataField) => hasValue(object));
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
      map((fieldSchemaArray: { field: MetadataField, schema: MetadataSchema }[]): string[] => {
        return fieldSchemaArray.map((fieldSchema: { field: MetadataField, schema: MetadataSchema }) => fieldSchema.schema.prefix + '.' + fieldSchema.field.toString());
      })
    );
