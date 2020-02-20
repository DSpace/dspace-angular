import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  find,
  first,
  map,
  mergeMap,
  skipWhile,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { getClassForType } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { SearchParam } from '../cache/models/search-param.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ErrorResponse, RestResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  configureRequest,
  getRemoteDataPayload,
  getResponseFromEntry,
  getSucceededRemoteData
} from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';
import { ChangeAnalyzer } from './change-analyzer';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import {
  CreateRequest,
  DeleteByIDRequest,
  FindByIDRequest,
  FindListOptions,
  FindListRequest,
  GetRequest
} from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';
import { RestRequestMethod } from './rest-request-method';

export abstract class DataService<T extends CacheableObject> {
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
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Create the HREF with given options object
   *
   * @param options The [[FindListOptions]] object
   * @param linkPath The link path for the object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   */
  protected getFindAllHref(options: FindListOptions = {}, linkPath?: string): Observable<string> {
    let result$: Observable<string>;
    const args = [];

    result$ = this.getBrowseEndpoint(options, linkPath).pipe(distinctUntilChanged());

    return result$.pipe(map((result: string) => this.buildHrefFromFindOptions(result, options, args)));
  }

  /**
   * Create the HREF for a specific object's search method with given options object
   *
   * @param searchMethod The search method for the object
   * @param options The [[FindListOptions]] object
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   */
  protected getSearchByHref(searchMethod: string, options: FindListOptions = {}): Observable<string> {
    let result$: Observable<string>;
    const args = [];

    result$ = this.getSearchEndpoint(searchMethod);

    if (hasValue(options.searchParams)) {
      options.searchParams.forEach((param: SearchParam) => {
        args.push(`${param.fieldName}=${param.fieldValue}`);
      })
    }

    return result$.pipe(map((result: string) => this.buildHrefFromFindOptions(result, options, args)));
  }

  /**
   * Turn an options object into a query string and combine it with the given HREF
   *
   * @param href The HREF to which the query string should be appended
   * @param options The [[FindListOptions]] object
   * @param extraArgs Array with additional params to combine with query string
   * @return {Observable<string>}
   *    Return an observable that emits created HREF
   */
  protected buildHrefFromFindOptions(href: string, options: FindListOptions, extraArgs: string[] = []): string {

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
    if (isNotEmpty(args)) {
      return new URLCombiner(href, `?${args.join('&')}`).toString();
    } else {
      return href;
    }
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findAll(options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<PaginatedList<T>>> {
    return this.findList(this.getFindAllHref(options), options, ...linksToFollow);
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on href observable,
   * with a list of {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   * @param href$           Observable of href of object we want to retrieve
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
   * Create the HREF for a specific object based on its identifier
   * @param endpoint The base endpoint for the type of object
   * @param resourceID The identifier for the object
   */
  getIDHref(endpoint, resourceID): string {
    return `${endpoint}/${resourceID}`;
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on its ID, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param id              ID of object we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findById(id: string, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<T>> {

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, encodeURIComponent(id))));

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
    const requestHref = this.buildHrefFromFindOptions(href, {}, []);
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
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findAllByHref(href: string, findListOptions: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<PaginatedList<T>>> {
    const requestHref = this.buildHrefFromFindOptions(href, findListOptions, []);
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
    return this.halService.getEndpoint(`${this.linkPath}/search`).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}/${searchMethod}`));
  }

  /**
   * Make a new FindListRequest with given search method
   *
   * @param searchMethod The search method for the object
   * @param options The [[FindListOptions]] object
   * @return {Observable<RemoteData<PaginatedList<T>>}
   *    Return an observable that emits response from the server
   */
  protected searchBy(searchMethod: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<PaginatedList<T>>> {

    const hrefObs = this.getSearchByHref(searchMethod, options);

    return hrefObs.pipe(
      find((href: string) => hasValue(href)),
      tap((href: string) => {
          this.requestService.removeByHrefSubstring(href);
          const request = new FindListRequest(this.requestService.generateRequestId(), href, options);
          request.responseMsToLive = 10 * 1000;

          this.requestService.configure(request);
        }
      ),
      switchMap((href) => this.requestService.getByHref(href)),
      skipWhile((requestEntry) => hasValue(requestEntry) && requestEntry.completed),
      switchMap((href) =>
        this.rdbService.buildList<T>(hrefObs, ...linksToFollow) as Observable<RemoteData<PaginatedList<T>>>
      )
    );
  }

  /**
   * Add a new patch to the object cache to a specified object
   * @param {string} href The selflink of the object that will be patched
   * @param {Operation[]} operations The patch operations to be performed
   */
  patch(href: string, operations: Operation[]) {
    this.objectCache.addPatch(href, operations);
  }

  /**
   * Add a new patch to the object cache
   * The patch is derived from the differences between the given object and its version in the object cache
   * @param {DSpaceObject} object The given object
   */
  update(object: T): Observable<RemoteData<T>> {
    const oldVersion$ = this.findByHref(object._links.self.href);
    return oldVersion$.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      mergeMap((oldVersion: T) => {
          const operations = this.comparator.diff(oldVersion, object);
          if (isNotEmpty(operations)) {
            this.objectCache.addPatch(object._links.self.href, operations);
          }
          return this.findByHref(object._links.self.href);
        }
      ));
  }

  /**
   * Create a new DSpaceObject on the server, and store the response
   * in the object cache
   *
   * @param {DSpaceObject} dso
   *    The object to create
   * @param {string} parentUUID
   *    The UUID of the parent to create the new object under
   */
  create(dso: T, parentUUID: string): Observable<RemoteData<T>> {
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpoint: string) => parentUUID ? `${endpoint}?parent=${parentUUID}` : endpoint)
    );

    const serializedDso = new DSpaceSerializer(getClassForType((dso as any).type)).serialize(dso);

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => new CreateRequest(requestId, endpoint, JSON.stringify(serializedDso)))
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
   * Delete an existing DSpace Object on the server
   * @param dso The DSpace Object to be removed
   * @param copyVirtualMetadata (optional parameter) the identifiers of the relationship types for which the virtual
   *                            metadata should be saved as real metadata
   * @return an observable that emits true when the deletion was successful, false when it failed
   */
  delete(dso: T, copyVirtualMetadata?: string[]): Observable<boolean> {
    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, dso.uuid)));

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
        const request = new DeleteByIDRequest(requestId, href, dso.uuid);
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      map((request: RequestEntry) => request.response.isSuccessful)
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
