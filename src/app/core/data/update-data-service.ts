import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Operation } from 'fast-json-patch';
import { AsyncSubject, combineLatest, from as observableFrom, Observable, of as observableOf } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  find,
  map,
  mergeMap,
  skipWhile,
  switchMap,
  take,
  takeWhile,
  tap,
  toArray
} from 'rxjs/operators';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { getClassForType } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheEntry } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceSerializer } from '../dspace-rest/dspace.serializer';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData, getRemoteDataPayload } from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';
import { ChangeAnalyzer } from './change-analyzer';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import {
  CreateRequest,
  DeleteByIDRequest,
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
  PutRequest
} from './request.models';
import { RequestService } from './request.service';
import { RestRequestMethod } from './rest-request-method';
import { GenericConstructor } from '../shared/generic-constructor';
import { NoContent } from '../shared/NoContent.model';
import { CacheableObject } from '../cache/cacheable-object.model';
import { CoreState } from '../core-state.model';
import { FindListOptions } from './find-list-options.model';
import { BaseDataService } from "./base/base-data.service";
import { FindAllData, FindAllDataImpl } from "./base/find-all-data";
import { SearchData, SearchDataImpl } from "./base/search-data";
import { CreateData, CreateDataImpl } from "./base/create-data";

export interface UpdateDataService<T> {
  patch(dso: T, operations: Operation[]): Observable<RemoteData<T>>;
  update(object: T): Observable<RemoteData<T>>;
  commitUpdates(method?: RestRequestMethod);
}


/**
 * Specific functionalities that not all services would need.
 * Goal of the class is to update remote objects, handling custom methods that don't belong to BaseDataService
 *
 * Custom methods are:
 *
 * patch - Sends a patch request to modify current object
 * update - Add a new patch to the object cache, diff between given object and cache
 * commitUpdates - Sends the updates to the server
 */


export abstract class UpdateDataServiceImpl<T extends CacheableObject> extends BaseDataService<T> implements UpdateDataService<T>, FindAllData<T>, SearchData<T>, CreateData<T> {
  protected abstract store: Store<CoreState>;
  protected abstract http: HttpClient;
  protected abstract comparator: ChangeAnalyzer<T>;

  private findAllData: FindAllDataImpl<T>;
  private searchData: SearchDataImpl<T>;
  private createData: CreateData<T>;


  constructor(
    protected linkPath: string,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected responseMsToLive: number,
  ) {
    super(linkPath, requestService, rdbService, objectCache, halService, responseMsToLive);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService ,this.responseMsToLive);
  }


  /**
   * Create the HREF with given options object
   *
   * @param options The [[FindListOptions]] object
   * @param linkPath The link path for the object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  public getFindAllHref(options: FindListOptions = {}, linkPath?: string, ...linksToFollow: FollowLinkConfig<T>[]): Observable<string> {
    return this.findAllData.getFindAllHref(options, linkPath, ...linksToFollow)
  }

  /**
   * Create the HREF for a specific object's search method with given options object
   *
   * @param searchMethod The search method for the object
   * @param options The [[FindListOptions]] object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  public getSearchByHref(searchMethod: string, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<T>[]): Observable<string> {
    return this.searchData.getSearchByHref(searchMethod, options, ...linksToFollow)
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   *
   * @param options                     Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>>}
   *    Return an observable that emits object list
   */
  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<PaginatedList<T>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow)
  }

  /**
   * Create the HREF for a specific object based on its identifier; with possible embed query params based on linksToFollow
   * @param endpoint The base endpoint for the type of object
   * @param resourceID The identifier for the object
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  getIDHref(endpoint, resourceID, ...linksToFollow: FollowLinkConfig<T>[]): string {
    return this.buildHrefFromFindOptions(endpoint + '/' + resourceID, {}, [], ...linksToFollow);
  }

  /**
   * Create an observable for the HREF of a specific object based on its identifier
   * @param resourceID The identifier for the object
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  getIDHrefObs(resourceID: string, ...linksToFollow: FollowLinkConfig<T>[]): Observable<string> {
    return this.getEndpoint().pipe(
      map((endpoint: string) => this.getIDHref(endpoint, resourceID, ...linksToFollow)));
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on its ID, with a list of
   * {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   * @param id                          ID of object we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    const href$ = this.getIDHrefObs(encodeURIComponent(id), ...linksToFollow);
    return this.findByHref(href$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * An operator that will call the given function if the incoming RemoteData is stale and
   * shouldReRequest is true
   *
   * @param shouldReRequest  Whether or not to call the re-request function if the RemoteData is stale
   * @param requestFn        The function to call if the RemoteData is stale and shouldReRequest is
   *                         true
   */
  protected reRequestStaleRemoteData<O>(shouldReRequest: boolean, requestFn: () => Observable<RemoteData<O>>) {
    return (source: Observable<RemoteData<O>>): Observable<RemoteData<O>> => {
      if (shouldReRequest === true) {
        return source.pipe(
          tap((remoteData: RemoteData<O>) => {
            if (hasValue(remoteData) && remoteData.isStale) {
              requestFn();
            }
          })
        );
      } else {
        return source;
      }
    };
  }

  /**
   * Make a new FindListRequest with given search method
   *
   * @param searchMethod                The search method for the object
   * @param options                     The [[FindListOptions]] object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>}
   *    Return an observable that emits response from the server
   */
  searchBy(searchMethod: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<PaginatedList<T>>> {
    return  this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow)
  }

  /**
   * Send a patch request for a specified object
   * @param {T} object The object to send a patch request for
   * @param {Operation[]} operations The patch operations to be performed
   */
  patch(object: T, operations: Operation[]): Observable<RemoteData<T>> {
    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, object.uuid)));

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
    ).subscribe((href: string) => {
      const request = new PatchRequest(requestId, href, operations);
      if (hasValue(this.responseMsToLive)) {
        request.responseMsToLive = this.responseMsToLive;
      }
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  createPatchFromCache(object: T): Observable<Operation[]> {
    const oldVersion$ = this.findByHref(object._links.self.href, true,  false);
    return oldVersion$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((oldVersion: T) => this.comparator.diff(oldVersion, object)));
  }

  /**
   * Send a PUT request for the specified object
   *
   * @param object The object to send a put request for.
   */
  put(object: T): Observable<RemoteData<T>> {
    const requestId = this.requestService.generateRequestId();
    const serializedObject = new DSpaceSerializer(object.constructor as GenericConstructor<{}>).serialize(object);
    const request = new PutRequest(requestId, object._links.self.href, serializedObject);

    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }

    this.requestService.send(request);

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Add a new patch to the object cache
   * The patch is derived from the differences between the given object and its version in the object cache
   * @param {DSpaceObject} object The given object
   */
  update(object: T): Observable<RemoteData<T>> {
    return this.createPatchFromCache(object)
      .pipe(
        mergeMap((operations: Operation[]) => {
            if (isNotEmpty(operations)) {
              this.objectCache.addPatch(object._links.self.href, operations);
            }
            return this.findByHref(object._links.self.href, true, true);
          }
        )
      );
  }

  /**
   * Create a new DSpaceObject on the server, and store the response
   * in the object cache
   *
   * @param {CacheableObject} object
   *    The object to create
   * @param {RequestParam[]} params
   *    Array with additional params to combine with query string
   */
  create(object: T, ...params: RequestParam[]): Observable<RemoteData<T>> {
    return this.createData.create(object, ...params)
  }

  /**
   <<<<<<< HEAD
   * Perform a post on an endpoint related item with ID. Ex.: endpoint/<itemId>/related?item=<relatedItemId>
   * @param itemId The item id
   * @param relatedItemId The related item Id
   * @param body The optional POST body
   * @return the RestResponse as an Observable
   */
  public postOnRelated(itemId: string, relatedItemId: string, body?: any) {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getIDHrefObs(itemId);

    hrefObs.pipe(
      take(1)
    ).subscribe((href: string) => {
      const request = new PostRequest(requestId, href + '/related?item=' + relatedItemId, body);
      if (hasValue(this.responseMsToLive)) {
        request.responseMsToLive = this.responseMsToLive;
      }
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID<T>(requestId);
  }

  /**
   * Perform a delete on an endpoint related item. Ex.: endpoint/<itemId>/related
   * @param itemId The item id
   * @return the RestResponse as an Observable
   */
  public deleteOnRelated(itemId: string): Observable<RemoteData<NoContent>> {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getIDHrefObs(itemId);

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new DeleteByIDRequest(requestId, href + '/related', itemId);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /*
   * Invalidate an existing DSpaceObject by marking all requests it is included in as stale
   * @param   objectId The id of the object to be invalidated
   * @return  An Observable that will emit `true` once all requests are stale
   */
  invalidate(objectId: string): Observable<boolean> {
    return this.getIDHrefObs(objectId).pipe(
      switchMap((href: string) => this.invalidateByHref(href))
    );
  }

  /**
   * Invalidate an existing DSpaceObject by marking all requests it is included in as stale
   * @param   href The self link of the object to be invalidated
   * @return  An Observable that will emit `true` once all requests are stale
   */
  invalidateByHref(href: string): Observable<boolean> {
    const done$ = new AsyncSubject<boolean>();

    this.objectCache.getByHref(href).pipe(
      switchMap((oce: ObjectCacheEntry) => observableFrom(oce.requestUUIDs).pipe(
        mergeMap((requestUUID: string) => this.requestService.setStaleByUUID(requestUUID)),
        toArray(),
      )),
    ).subscribe(() => {
      done$.next(true);
      done$.complete();
    });

    return done$;
  }

  /**
   * Delete an existing DSpace Object on the server
   * @param   objectId The id of the object to be removed
   * @param   copyVirtualMetadata (optional parameter) the identifiers of the relationship types for which the virtual
   *                            metadata should be saved as real metadata
   * @return  A RemoteData observable with an empty payload, but still representing the state of the request: statusCode,
   *          errorMessage, timeCompleted, etc
   */
  delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.getIDHrefObs(objectId).pipe(
      switchMap((href: string) => this.deleteByHref(href, copyVirtualMetadata))
    );
  }

  /**
   * Delete an existing DSpace Object on the server
   * @param   href The self link of the object to be removed
   * @param   copyVirtualMetadata (optional parameter) the identifiers of the relationship types for which the virtual
   *                            metadata should be saved as real metadata
   * @return  A RemoteData observable with an empty payload, but still representing the state of the request: statusCode,
   *          errorMessage, timeCompleted, etc
   *          Only emits once all request related to the DSO has been invalidated.
   */
  deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    const requestId = this.requestService.generateRequestId();

    if (copyVirtualMetadata) {
      copyVirtualMetadata.forEach((id) =>
        href += (href.includes('?') ? '&' : '?')
          + 'copyVirtualMetadata='
          + id
      );
    }

    const request = new DeleteRequest(requestId, href);
    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }
    this.requestService.send(request);

    const response$ = this.rdbService.buildFromRequestUUID(requestId);

    const invalidated$ = new AsyncSubject<boolean>();
    response$.pipe(
      getFirstCompletedRemoteData(),
      switchMap((rd: RemoteData<NoContent>) => {
        if (rd.hasSucceeded) {
          return this.invalidateByHref(href);
        } else {
          return [true];
        }
      })
    ).subscribe(() => {
      invalidated$.next(true);
      invalidated$.complete();
    });

    return combineLatest([response$, invalidated$]).pipe(
      filter(([_, invalidated]) => invalidated),
      map(([response, _]) => response),
    );
  }

  /**
   * Commit current object changes to the server
   * @param method The RestRequestMethod for which de server sync buffer should be committed
   */
  commitUpdates(method?: RestRequestMethod) {
    this.requestService.commit(method);
  }
}
