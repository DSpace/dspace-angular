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
  take,
  takeWhile,
  switchMap,
  tap,
  skipWhile, toArray
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
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getRemoteDataPayload, getFirstSucceededRemoteData, getFirstCompletedRemoteData } from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';
import { ChangeAnalyzer } from './change-analyzer';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import {
  CreateRequest,
  GetRequest,
  PatchRequest,
  PutRequest,
  DeleteRequest
} from './request.models';
import { RequestService } from './request.service';
import { RestRequestMethod } from './rest-request-method';
import { UpdateDataService } from './update-data.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { NoContent } from '../shared/NoContent.model';
import { CacheableObject } from '../cache/cacheable-object.model';
import { CoreState } from '../core-state.model';
import { FindListOptions } from './find-list-options.model';

export abstract class DataService<T extends CacheableObject> implements UpdateDataService<T> {
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract linkPath: string;
  protected abstract halService: HALEndpointService;
  protected abstract objectCache: ObjectCacheService;
  protected abstract notificationsService: NotificationsService;
  protected abstract http: HttpClient;
  protected abstract comparator: ChangeAnalyzer<T>;

  /**
   * Allows subclasses to reset the response cache time.
   */
  protected responseMsToLive: number;

  /**
   * Get the endpoint for browsing
   * @param options The [[FindListOptions]] object
   * @param linkPath The link path for the object
   * @returns {Observable<string>}
   */
  getBrowseEndpoint(options: FindListOptions = {}, linkPath?: string): Observable<string> {
    return this.getEndpoint();
  }

  /**
   * Get the base endpoint for all requests
   */
  protected getEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
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
    let endpoint$: Observable<string>;
    const args = [];

    endpoint$ = this.getBrowseEndpoint(options).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => isNotEmpty(linkPath) ? `${href}/${linkPath}` : href),
      distinctUntilChanged()
    );

    return endpoint$.pipe(map((result: string) => this.buildHrefFromFindOptions(result, options, args, ...linksToFollow)));
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
    let result$: Observable<string>;
    const args = [];

    result$ = this.getSearchEndpoint(searchMethod);

    return result$.pipe(map((result: string) => this.buildHrefFromFindOptions(result, options, args, ...linksToFollow)));
  }

  /**
   * Turn an options object into a query string and combine it with the given HREF
   *
   * @param href The HREF to which the query string should be appended
   * @param options The [[FindListOptions]] object
   * @param extraArgs Array with additional params to combine with query string
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  public buildHrefFromFindOptions(href: string, options: FindListOptions, extraArgs: string[] = [], ...linksToFollow: FollowLinkConfig<T>[]): string {
    let args = [...extraArgs];

    if (hasValue(options.currentPage) && typeof options.currentPage === 'number') {
      /* TODO: this is a temporary fix for the pagination start index (0 or 1) discrepancy between the rest and the frontend respectively */
      args = this.addHrefArg(href, args, `page=${options.currentPage - 1}`);
    }
    if (hasValue(options.elementsPerPage)) {
      args = this.addHrefArg(href, args, `size=${options.elementsPerPage}`);
    }
    if (hasValue(options.sort)) {
      args = this.addHrefArg(href, args, `sort=${options.sort.field},${options.sort.direction}`);
    }
    if (hasValue(options.startsWith)) {
      args = this.addHrefArg(href, args, `startsWith=${options.startsWith}`);
    }
    if (hasValue(options.searchParams)) {
      options.searchParams.forEach((param: RequestParam) => {
        args = this.addHrefArg(href, args, `${param.fieldName}=${param.fieldValue}`);
      });
    }
    args = this.addEmbedParams(href, args, ...linksToFollow);
    if (isNotEmpty(args)) {
      return new URLCombiner(href, `?${args.join('&')}`).toString();
    } else {
      return href;
    }
  }

  /**
   * Turn an array of RequestParam into a query string and combine it with the given HREF
   *
   * @param href The HREF to which the query string should be appended
   * @param params Array with additional params to combine with query string
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   *
   * @return {Observable<string>}
   * Return an observable that emits created HREF
   */
  protected buildHrefWithParams(href: string, params: RequestParam[], ...linksToFollow: FollowLinkConfig<T>[]): string {

    let  args = [];
    if (hasValue(params)) {
      params.forEach((param: RequestParam) => {
        args = this.addHrefArg(href, args, `${param.fieldName}=${param.fieldValue}`);
      });
    }

    args = this.addEmbedParams(href, args, ...linksToFollow);

    if (isNotEmpty(args)) {
      return new URLCombiner(href, `?${args.join('&')}`).toString();
    } else {
      return href;
    }
  }
  /**
   * Adds the embed options to the link for the request
   * @param href            The href the params are to be added to
   * @param args            params for the query string
   * @param linksToFollow   links we want to embed in query string if shouldEmbed is true
   */
  protected addEmbedParams(href: string, args: string[], ...linksToFollow: FollowLinkConfig<T>[]) {
    linksToFollow.forEach((linkToFollow: FollowLinkConfig<T>) => {
      if (hasValue(linkToFollow) && linkToFollow.shouldEmbed) {
        const embedString = 'embed=' + String(linkToFollow.name);
        // Add the embeds size if given in the FollowLinkConfig.FindListOptions
        if (hasValue(linkToFollow.findListOptions) && hasValue(linkToFollow.findListOptions.elementsPerPage)) {
          args = this.addHrefArg(href, args,
            'embed.size=' + String(linkToFollow.name) + '=' + linkToFollow.findListOptions.elementsPerPage);
        }
        // Adds the nested embeds and their size if given
        if (isNotEmpty(linkToFollow.linksToFollow)) {
          args = this.addNestedEmbeds(embedString, href, args, ...linkToFollow.linksToFollow);
        } else {
          args = this.addHrefArg(href, args, embedString);
        }
      }
    });
    return args;
  }

  /**
   * Add a new argument to the list of arguments, only if it doesn't already exist in the given href,
   * or the current list of arguments
   *
   * @param href        The href the arguments are to be added to
   * @param currentArgs The current list of arguments
   * @param newArg      The new argument to add
   * @return            The next list of arguments, with newArg included if it wasn't already.
   *                    Note this function will not modify any of the input params.
   */
  protected addHrefArg(href: string, currentArgs: string[], newArg: string): string[] {
    if (href.includes(newArg) || currentArgs.includes(newArg)) {
      return [...currentArgs];
    } else {
      return [...currentArgs, newArg];
    }
  }

  /**
   * Add the nested followLinks to the embed param, separated by a /, and their sizes, recursively
   * @param embedString     embedString so far (recursive)
   * @param href            The href the params are to be added to
   * @param args            params for the query string
   * @param linksToFollow   links we want to embed in query string if shouldEmbed is true
   */
  protected addNestedEmbeds(embedString: string, href: string, args: string[], ...linksToFollow: FollowLinkConfig<T>[]): string[] {
    let nestEmbed = embedString;
    linksToFollow.forEach((linkToFollow: FollowLinkConfig<T>) => {
      if (hasValue(linkToFollow) && linkToFollow.shouldEmbed) {
        nestEmbed = nestEmbed + '/' + String(linkToFollow.name);
        // Add the nested embeds size if given in the FollowLinkConfig.FindListOptions
        if (hasValue(linkToFollow.findListOptions) && hasValue(linkToFollow.findListOptions.elementsPerPage)) {
          const nestedEmbedSize = 'embed.size=' + nestEmbed.split('=')[1] + '=' + linkToFollow.findListOptions.elementsPerPage;
          args = this.addHrefArg(href, args, nestedEmbedSize);
        }
        if (hasValue(linkToFollow.linksToFollow) && isNotEmpty(linkToFollow.linksToFollow)) {
          args = this.addNestedEmbeds(nestEmbed, href, args, ...linkToFollow.linksToFollow);
        } else {
          args = this.addHrefArg(href, args, nestEmbed);
        }
      }
    });
    return args;
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
    return this.findAllByHref(this.getFindAllHref(options), options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
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
   * Returns an observable of {@link RemoteData} of an object, based on an href, with a list of
   * {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   * @param href$                       The url of object we want to retrieve. Can be a string or
   *                                    an Observable<string>
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findByHref(href$: string | Observable<string>, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<T>> {
    if (typeof href$ === 'string') {
      href$ = observableOf(href$);
    }

    const requestHref$ = href$.pipe(
      isNotEmptyOperator(),
      take(1),
      map((href: string) => this.buildHrefFromFindOptions(href, {}, [], ...linksToFollow))
    );

    this.createAndSendGetRequest(requestHref$, useCachedVersionIfAvailable);

    return this.rdbService.buildSingle<T>(requestHref$, ...linksToFollow).pipe(
      // This skip ensures that if a stale object is present in the cache when you do a
      // call it isn't immediately returned, but we wait until the remote data for the new request
      // is created. If useCachedVersionIfAvailable is false it also ensures you don't get a
      // cached completed object
      skipWhile((rd: RemoteData<T>) => useCachedVersionIfAvailable ? rd.isStale : rd.hasCompleted),
      this.reRequestStaleRemoteData(reRequestOnStale, () =>
        this.findByHref(href$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow))
    );
  }

  /**
   * Returns a list of observables of {@link RemoteData} of objects, based on an href, with a list
   * of {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   * @param href$                       The url of object we want to retrieve. Can be a string or
   *                                    an Observable<string>
   * @param findListOptions             Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findAllByHref(href$: string | Observable<string>, findListOptions: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<PaginatedList<T>>> {
    if (typeof href$ === 'string') {
      href$ = observableOf(href$);
    }

    const requestHref$ = href$.pipe(
      isNotEmptyOperator(),
      take(1),
      map((href: string) => this.buildHrefFromFindOptions(href, findListOptions, [], ...linksToFollow))
    );

    this.createAndSendGetRequest(requestHref$, useCachedVersionIfAvailable);

    return this.rdbService.buildList<T>(requestHref$, ...linksToFollow).pipe(
      // This skip ensures that if a stale object is present in the cache when you do a
      // call it isn't immediately returned, but we wait until the remote data for the new request
      // is created. If useCachedVersionIfAvailable is false it also ensures you don't get a
      // cached completed object
      skipWhile((rd: RemoteData<PaginatedList<T>>) => useCachedVersionIfAvailable ? rd.isStale : rd.hasCompleted),
      this.reRequestStaleRemoteData(reRequestOnStale, () =>
        this.findAllByHref(href$, findListOptions, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow))
    );
  }

  /**
   * Create a GET request for the given href, and send it.
   *
   * @param href$                       The url of object we want to retrieve. Can be a string or
   *                                    an Observable<string>
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   */
  protected createAndSendGetRequest(href$: string | Observable<string>, useCachedVersionIfAvailable = true): void {
    if (isNotEmpty(href$)) {
      if (typeof href$ === 'string') {
        href$ = observableOf(href$);
      }

      href$.pipe(
        isNotEmptyOperator(),
        take(1)
      ).subscribe((href: string) => {
        const requestId = this.requestService.generateRequestId();
        const request = new GetRequest(requestId, href);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.send(request, useCachedVersionIfAvailable);
      });
    }
  }

  /**
   * Return object search endpoint by given search method
   *
   * @param searchMethod The search method for the object
   */
  protected getSearchEndpoint(searchMethod: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}/search/${searchMethod}`));
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
    const hrefObs = this.getSearchByHref(searchMethod, options, ...linksToFollow);

    return this.findAllByHref(hrefObs, undefined, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
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
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.getEndpoint().pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpoint: string) => this.buildHrefWithParams(endpoint, params))
    );

    const serializedObject = new DSpaceSerializer(getClassForType(object.type)).serialize(object);

    endpoint$.pipe(
      take(1)
    ).subscribe((endpoint: string) => {
      const request = new CreateRequest(requestId, endpoint, JSON.stringify(serializedObject));
      if (hasValue(this.responseMsToLive)) {
        request.responseMsToLive = this.responseMsToLive;
      }
      this.requestService.send(request);
    });

    const result$ = this.rdbService.buildFromRequestUUID<T>(requestId);

    // TODO a dataservice is not the best place to show a notification,
    // this should move up to the components that use this method
    result$.pipe(
      takeWhile((rd: RemoteData<T>) => rd.isLoading, true)
    ).subscribe((rd: RemoteData<T>) => {
      if (rd.hasFailed) {
        this.notificationsService.error('Server Error:', rd.errorMessage, new NotificationOptions(-1));
      }
    });

    return result$;
  }

  /**
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

  /**
   * Return the links to traverse from the root of the api to the
   * endpoint this DataService represents
   *
   * e.g. if the api root links to 'foo', and the endpoint at 'foo'
   * links to 'bar' the linkPath for the BarDataService would be
   * 'foo/bar'
   */
  getLinkPath(): string {
    return this.linkPath;
  }
}
