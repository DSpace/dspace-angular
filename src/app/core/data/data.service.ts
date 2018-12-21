import {
  delay,
  distinctUntilChanged,
  filter,
  find,
  switchMap,
  map,
  take,
  tap, first, mergeMap
} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import {
  CreateRequest,
  FindAllOptions,
  FindAllRequest,
  FindByIDRequest,
  GetRequest, RestRequest
} from './request.models';
import { RequestService } from './request.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { compare, Operation } from 'fast-json-patch';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import {
  configureRequest,
  filterSuccessfulResponses, getResourceLinksFromResponse,
  getResponseFromEntry
} from '../shared/operators';
import { DSOSuccessResponse, ErrorResponse, RestResponse } from '../cache/response.models';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { CacheableObject } from '../cache/object-cache.reducer';
import { DataBuildService } from '../cache/builders/data-build.service';
import { UpdateComparator } from './update-comparator';

export abstract class DataService<TNormalized extends NormalizedObject, TDomain extends CacheableObject> {
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract dataBuildService: DataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract linkPath: string;
  protected abstract halService: HALEndpointService;
  protected abstract objectCache: ObjectCacheService;
  protected abstract notificationsService: NotificationsService;
  protected abstract http: HttpClient;
  protected abstract comparator: UpdateComparator<TNormalized>;

  public abstract getBrowseEndpoint(options: FindAllOptions, linkPath?: string): Observable<string>

  protected getFindAllHref(options: FindAllOptions = {}, linkPath?: string): Observable<string> {
    let result: Observable<string>;
    const args = [];

    result = this.getBrowseEndpoint(options, linkPath);
    if (hasValue(options.currentPage) && typeof options.currentPage === 'number') {
      /* TODO: this is a temporary fix for the pagination start index (0 or 1) discrepancy between the rest and the frontend respectively */
      args.push(`page=${options.currentPage - 1}`);
    }
    if (hasValue(options.elementsPerPage)) {
      args.push(`size=${options.elementsPerPage}`);
    }
    if (hasValue(options.sort)) {
      args.push(`sort=${options.sort.field},${options.sort.direction}`);
    }
    if (hasValue(options.startsWith)) {
      args.push(`startsWith=${options.startsWith}`);
    }
    if (isNotEmpty(args)) {
      return result.pipe(map((href: string) => new URLCombiner(href, `?${args.join('&')}`).toString()));
    } else {
      return result;
    }
  }

  findAll(options: FindAllOptions = {}): Observable<RemoteData<PaginatedList<TDomain>>> {
    const hrefObs = this.getFindAllHref(options);

    hrefObs.pipe(
      filter((href: string) => hasValue(href)),
      take(1))
      .subscribe((href: string) => {
        const request = new FindAllRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<TNormalized, TDomain>(hrefObs) as Observable<RemoteData<PaginatedList<TDomain>>>;
  }

  getFindByIDHref(endpoint, resourceID): string {
    return `${endpoint}/${resourceID}`;
  }

  findById(id: string): Observable<RemoteData<TDomain>> {
    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getFindByIDHref(endpoint, id)));

    hrefObs.pipe(
      find((href: string) => hasValue(href)))
      .subscribe((href: string) => {
        const request = new FindByIDRequest(this.requestService.generateRequestId(), href, id);
        this.requestService.configure(request);
      });

    return this.rdbService.buildSingle<TNormalized, TDomain>(hrefObs);
  }

  findByHref(href: string): Observable<RemoteData<TDomain>> {
    this.requestService.configure(new GetRequest(this.requestService.generateRequestId(), href));
    return this.rdbService.buildSingle<TNormalized, TDomain>(href);
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
  update(object: TDomain): Observable<RemoteData<TDomain>> {
    const oldVersion$ = this.objectCache.getBySelfLink(object.self);
    return oldVersion$.pipe(first(), mergeMap((oldVersion: TNormalized) => {
        const newVersion = this.dataBuildService.normalize<TDomain, TNormalized>(object);
        const operations = this.comparator.compare(oldVersion, newVersion);
        if (isNotEmpty(operations)) {
          this.objectCache.addPatch(object.self, operations);
        }
        return this.findById(object.uuid);
      }
    ));

  }

  create(dso: TDomain, parentUUID: string): Observable<RemoteData<TDomain>> {
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpoint: string) => parentUUID ? `${endpoint}?parentCommunity=${parentUUID}` : endpoint)
    );

    const normalizedObject: TNormalized = this.dataBuildService.normalize<TDomain, TNormalized>(dso);
    const serializedDso = new DSpaceRESTv2Serializer(NormalizedObjectFactory.getConstructor(dso.type)).serialize(normalizedObject);

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

}
