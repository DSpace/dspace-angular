import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, find, first, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { getClassForType } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ErrorResponse, RestResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { configureRequest, getRemoteDataPayload, getResponseFromEntry, getSucceededRemoteData } from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';
import { ChangeAnalyzer } from './change-analyzer';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { CreateRequest, DeleteByIDRequest, FindByIDRequest, FindListOptions, FindListRequest, GetRequest, PatchRequest, PutRequest } from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';
import { RestRequestMethod } from './rest-request-method';
import { UpdateDataService } from './update-data.service';
import { GenericConstructor } from '../shared/generic-constructor';

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
  protected getFindAllHref(options: FindListOptions = {}, linkPath?: string, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<string> {
    let result$: Observable<string>;
    const args = [];

    result$ = this.getBrowseEndpoint(options, linkPath).pipe(distinctUntilChanged());

    return result$.pipe(map((result: string) => this.buildHrefFromFindOptions(result, options, args, ...linksToFollow)));
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
  protected getSearchByHref(searchMethod: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<string> {
    let result$: Observable<string>;
    const args = [];

    result$ = this.getSearchEndpoint(searchMethod);

    if (hasValue(options.searchParams)) {
      options.searchParams.forEach((param: RequestParam) => {
        args.push(`${param.fieldName}=${param.fieldValue}`);
      })
    }

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
  protected buildHrefFromFindOptions(href: string, options: FindListOptions, extraArgs: string[] = [], ...linksToFollow: Array<FollowLinkConfig<T>>): string {
    let args = [...extraArgs];

    if (hasValue(options.currentPage) && typeof options.currentPage === 'number') {
      /* TODO: this is a temporary fix for the pagination start index (0 or 1) discrepancy between the rest and the frontend respectively */
      args = [...args, `page=${options.currentPage - 1}`];
    }
    if (hasValue(options.elementsPerPage)) {
      args = [...args, `size=${options.elementsPerPage}`];
    }
    if (hasValue(options.sort)) {
      args = [...args, `sort=${options.sort.field},${options.sort.direction}`];
    }
    if (hasValue(options.startsWith)) {
      args = [...args, `startsWith=${options.startsWith}`];
    }
    args = this.addEmbedParams(args, ...linksToFollow);
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
  protected buildHrefWithParams(href: string, params: RequestParam[], ...linksToFollow: Array<FollowLinkConfig<T>>): string {

    let  args = [];
    if (hasValue(params)) {
      params.forEach((param: RequestParam) => {
        args.push(`${param.fieldName}=${param.fieldValue}`);
      })
    }

    args = this.addEmbedParams(args, ...linksToFollow);

    if (isNotEmpty(args)) {
      return new URLCombiner(href, `?${args.join('&')}`).toString();
    } else {
      return href;
    }
  }
  /**
   * Adds the embed options to the link for the request
   * @param args            params for the query string
   * @param linksToFollow   links we want to embed in query string if shouldEmbed is true
   */
  protected addEmbedParams(args: string[], ...linksToFollow: Array<FollowLinkConfig<T>>) {
    linksToFollow.forEach((linkToFollow: FollowLinkConfig<T>) => {
      if (linkToFollow !== undefined && linkToFollow.shouldEmbed) {
        const embedString = 'embed=' + String(linkToFollow.name);
        const embedWithNestedString = this.addNestedEmbeds(embedString, ...linkToFollow.linksToFollow);
        args = [...args, embedWithNestedString];
      }
    });
    return args;
  }

  /**
   * Add the nested followLinks to the embed param, recursively, separated by a /
   * @param embedString     embedString so far (recursive)
   * @param linksToFollow   links we want to embed in query string if shouldEmbed is true
   */
  protected addNestedEmbeds(embedString: string, ...linksToFollow: Array<FollowLinkConfig<T>>): string {
    let nestEmbed = embedString;
    linksToFollow.forEach((linkToFollow: FollowLinkConfig<T>) => {
      if (linkToFollow !== undefined && linkToFollow.shouldEmbed) {
        nestEmbed = nestEmbed + '/' + String(linkToFollow.name);
        if (linkToFollow.linksToFollow !== undefined) {
          nestEmbed = this.addNestedEmbeds(nestEmbed, ...linkToFollow.linksToFollow);
        }
      }
    });
    return nestEmbed;
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   *
   * @param options         Find list options object
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>>}
   *    Return an observable that emits object list
   */
  findAll(options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<PaginatedList<T>>> {
    return this.findList(this.getFindAllHref(options), options, ...linksToFollow);
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on href observable,
   * with a list of {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   * @param href$           Observable of href of object we want to retrieve
   * @param options         Find list options object
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  protected findList(href$, options: FindListOptions, ...linksToFollow: Array<FollowLinkConfig<T>>) {
    href$.pipe(
      first((href: string) => hasValue(href)))
      .subscribe((href: string) => {
        const request = new FindListRequest(this.requestService.generateRequestId(), href, options);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<T>(href$, ...linksToFollow) as Observable<RemoteData<PaginatedList<T>>>;
  }

  /**
   * Create the HREF for a specific object based on its identifier; with possible embed query params based on linksToFollow
   * @param endpoint The base endpoint for the type of object
   * @param resourceID The identifier for the object
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  getIDHref(endpoint, resourceID, ...linksToFollow: Array<FollowLinkConfig<T>>): string {
    return this.buildHrefFromFindOptions(endpoint + '/' + resourceID, {}, [], ...linksToFollow);
  }

  /**
   * Create an observable for the HREF of a specific object based on its identifier
   * @param resourceID The identifier for the object
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  getIDHrefObs(resourceID: string, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<string> {
    return this.getEndpoint().pipe(
      map((endpoint: string) => this.getIDHref(endpoint, resourceID, ...linksToFollow)));
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on its ID, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param id              ID of object we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findById(id: string, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<T>> {
    const hrefObs = this.getIDHrefObs(encodeURIComponent(id), ...linksToFollow);

    hrefObs.pipe(
      find((href: string) => hasValue(href)))
      .subscribe((href: string) => {
        const request = new FindByIDRequest(this.requestService.generateRequestId(), href, id);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.configure(request);
      });

    return this.rdbService.buildSingle<T>(hrefObs, ...linksToFollow);
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param href            The url of object we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findByHref(href: string, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<T>> {
    const requestHref = this.buildHrefFromFindOptions(href, {}, [], ...linksToFollow);
    const request = new GetRequest(this.requestService.generateRequestId(), requestHref);
    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }
    this.requestService.configure(request);
    return this.rdbService.buildSingle<T>(href, ...linksToFollow);
  }

  /**
   * Returns a list of observables of {@link RemoteData} of objects, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param href            The url of object we want to retrieve
   * @param findListOptions Find list options object
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findAllByHref(href: string, findListOptions: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<PaginatedList<T>>> {
    const requestHref = this.buildHrefFromFindOptions(href, findListOptions, [], ...linksToFollow);
    const request = new GetRequest(this.requestService.generateRequestId(), requestHref);
    if (hasValue(this.responseMsToLive)) {
      request.responseMsToLive = this.responseMsToLive;
    }
    this.requestService.configure(request);
    return this.rdbService.buildList<T>(requestHref, ...linksToFollow);
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
   * @param searchMethod The search method for the object
   * @param options The [[FindListOptions]] object
   * @param linksToFollow The array of [[FollowLinkConfig]]
   * @return {Observable<RemoteData<PaginatedList<T>>}
   *    Return an observable that emits response from the server
   */
  searchBy(searchMethod: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<PaginatedList<T>>> {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getSearchByHref(searchMethod, options, ...linksToFollow);

    hrefObs.pipe(
      find((href: string) => hasValue(href))
    ).subscribe((href: string) => {
      const request = new FindListRequest(requestId, href, options);
      if (hasValue(this.responseMsToLive)) {
        request.responseMsToLive = this.responseMsToLive;
      }
      this.requestService.configure(request);
    });

    return this.requestService.getByUUID(requestId).pipe(
      find((requestEntry) => hasValue(requestEntry) && requestEntry.completed),
      switchMap((requestEntry) =>
        this.rdbService.buildList<T>(requestEntry.request.href, ...linksToFollow)
      ),
    );
  }

  /**
   * Send a patch request for a specified object
   * @param {T} dso The object to send a patch request for
   * @param {Operation[]} operations The patch operations to be performed
   */
  patch(dso: T, operations: Operation[]): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, dso.uuid)));

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PatchRequest(requestId, href, operations);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      map((request: RequestEntry) => request.response)
    );
  }

  createPatchFromCache(object: T): Observable<Operation[]> {
    const oldVersion$ = this.findByHref(object._links.self.href);
    return oldVersion$.pipe(
      getSucceededRemoteData(),
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

    this.requestService.configure(request);

    return this.requestService.getByUUID(requestId).pipe(
      find((re: RequestEntry) => hasValue(re) && re.completed),
      switchMap(() => this.findByHref(object._links.self.href))
    );
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
            return this.findByHref(object._links.self.href);
          }
        )
      );
  }

  /**
   * Create a new DSpaceObject on the server, and store the response
   * in the object cache
   *
   * @param {DSpaceObject} dso
   *    The object to create
   * @param {RequestParam[]} params
   *    Array with additional params to combine with query string
   */
  create(dso: T, ...params: RequestParam[]): Observable<RemoteData<T>> {
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.getEndpoint().pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpoint: string) => this.buildHrefWithParams(endpoint, params))
    );

    const serializedDso = new DSpaceSerializer(getClassForType((dso as any).type)).serialize(dso);

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => {
        const request = new CreateRequest(requestId, endpoint, JSON.stringify(serializedDso));
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        return request
      })
    );

    // Execute the post request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    // Resolve self link for new object
    const selfLink$ = this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        if (!response.isSuccessful && response instanceof ErrorResponse) {
          this.notificationsService.error('Server Error:', response.errorMessage, new NotificationOptions(-1));
        } else {
          return response;
        }
      }),
      map((response: any) => {
        if (isNotEmpty(response.resourceSelfLinks)) {
          return response.resourceSelfLinks[0];
        }
      }),
      distinctUntilChanged()
    ) as Observable<string>;

    return selfLink$.pipe(
      switchMap((selfLink: string) => this.findByHref(selfLink)),
    )
  }

  /**
   * Create a new DSpaceObject on the server, and store the response
   * in the object cache, returns observable of the response to determine success
   *
   * @param {DSpaceObject} dso
   *    The object to create
   */
  tryToCreate(dso: T): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
    );

    const serializedDso = new DSpaceSerializer(getClassForType((dso as any).type)).serialize(dso);

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => {
        const request = new CreateRequest(requestId, endpoint, JSON.stringify(serializedDso));
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        return request
      })
    );

    // Execute the post request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    return this.fetchResponse(requestId);
  }

  /**
   * Gets the restResponse from the requestService
   * @param requestId
   */
  protected fetchResponse(requestId: string): Observable<RestResponse> {
    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        return response;
      })
    );
  }

  /**
   * Delete an existing DSpace Object on the server
   * @param dsoID The DSpace Object' id to be removed
   * @param copyVirtualMetadata (optional parameter) the identifiers of the relationship types for which the virtual
   *                            metadata should be saved as real metadata
   * @return the RestResponse as an Observable
   */
  delete(dsoID: string, copyVirtualMetadata?: string[]): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.getIDHrefObs(dsoID);

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        if (copyVirtualMetadata) {
          copyVirtualMetadata.forEach((id) =>
            href += (href.includes('?') ? '&' : '?')
              + 'copyVirtualMetadata='
              + id
          );
        }
        const request = new DeleteByIDRequest(requestId, href, dsoID);
        if (hasValue(this.responseMsToLive)) {
          request.responseMsToLive = this.responseMsToLive;
        }
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      map((request: RequestEntry) => request.response)
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
