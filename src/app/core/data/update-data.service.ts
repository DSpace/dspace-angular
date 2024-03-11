import { Operation } from 'fast-json-patch';
import {
  AsyncSubject,
  from as observableFrom,
  Observable,
} from 'rxjs';
import {
  find,
  map,
  mergeMap,
  switchMap,
  take,
  toArray,
} from 'rxjs/operators';

import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CacheableObject } from '../cache/cacheable-object.model';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheEntry } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NoContent } from '../shared/NoContent.model';
import {
  CreateData,
  CreateDataImpl,
} from './base/create-data';
import {
  DeleteData,
  DeleteDataImpl,
} from './base/delete-data';
import {
  FindAllData,
  FindAllDataImpl,
} from './base/find-all-data';
import { IdentifiableDataService } from './base/identifiable-data.service';
import {
  PatchData,
  PatchDataImpl,
} from './base/patch-data';
import {
  PutData,
  PutDataImpl,
} from './base/put-data';
import {
  SearchData,
  SearchDataImpl,
} from './base/search-data';
import { ChangeAnalyzer } from './change-analyzer';
import { FindListOptions } from './find-list-options.model';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import {
  DeleteByIDRequest,
  PostRequest,
} from './request.models';
import { RequestService } from './request.service';
import { RestRequestMethod } from './rest-request-method';

/**
 * Interface to list the methods used by the injected service in components
 */
export interface UpdateDataService<T> {
  patch(dso: T, operations: Operation[]): Observable<RemoteData<T>>;
  update(object: T): Observable<RemoteData<T>>;
  commitUpdates(method?: RestRequestMethod): void;
}


/**
 * Specific functionalities that not all services would need.
 * Goal of the class is to update remote objects, handling custom methods that don't belong to BaseDataService
 * The class implements also the following common interfaces
 *
 * findAllData: FindAllData<T>;
 * searchData: SearchData<T>;
 * createData: CreateData<T>;
 * patchData: PatchData<T>;
 * putData: PutData<T>;
 * deleteData: DeleteData<T>;
 *
 * Custom methods are:
 *
 * deleteOnRelated - delete all related objects to the given one
 * postOnRelated - post all the related objects to the given one
 * invalidate - invalidate the DSpaceObject making all requests as stale
 * invalidateByHref - invalidate the href making all requests as stale
 */

export class UpdateDataServiceImpl<T extends CacheableObject> extends IdentifiableDataService<T> implements FindAllData<T>, SearchData<T>, CreateData<T>, PatchData<T>, PutData<T>, DeleteData<T> {
  private findAllData: FindAllDataImpl<T>;
  private searchData: SearchDataImpl<T>;
  private createData: CreateDataImpl<T>;
  private patchData: PatchDataImpl<T>;
  private putData: PutDataImpl<T>;
  private deleteData: DeleteDataImpl<T>;


  constructor(
    protected linkPath: string,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected comparator: ChangeAnalyzer<T>,
    protected responseMsToLive: number,
  ) {
    super(linkPath, requestService, rdbService, objectCache, halService, responseMsToLive);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService ,this.responseMsToLive);
    this.patchData = new PatchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, comparator ,this.responseMsToLive, this.constructIdEndpoint);
    this.putData = new PutDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService ,this.responseMsToLive, this.constructIdEndpoint);
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
    return this.findAllData.getFindAllHref(options, linkPath, ...linksToFollow);
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
    return this.searchData.getSearchByHref(searchMethod, options, ...linksToFollow);
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
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
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
    return  this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Send a patch request for a specified object
   * @param {T} object The object to send a patch request for
   * @param {Operation[]} operations The patch operations to be performed
   */
  patch(object: T, operations: Operation[]): Observable<RemoteData<T>> {
    return this.patchData.patch(object, operations);
  }

  createPatchFromCache(object: T): Observable<Operation[]> {
    return this.patchData.createPatchFromCache(object);
  }

  /**
   * Send a PUT request for the specified object
   *
   * @param object The object to send a put request for.
   */
  put(object: T): Observable<RemoteData<T>> {
    return this.putData.put(object);
  }

  /**
   * Add a new patch to the object cache
   * The patch is derived from the differences between the given object and its version in the object cache
   * @param {DSpaceObject} object The given object
   */
  update(object: T): Observable<RemoteData<T>> {
    return this.patchData.update(object);
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
    return this.createData.create(object, ...params);
  }
  /**
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
      take(1),
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
      }),
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
      switchMap((href: string) => this.invalidateByHref(href)),
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
    return this.deleteData.delete(objectId, copyVirtualMetadata);
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
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }

  /**
   * Commit current object changes to the server
   * @param method The RestRequestMethod for which de server sync buffer should be committed
   */
  commitUpdates(method?: RestRequestMethod) {
    this.patchData.commitUpdates(method);
  }
}
