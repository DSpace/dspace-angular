import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResponseCacheService } from '../cache/response-cache.service';
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
  GetRequest,
  RestRequest
} from './request.models';
import { RequestService } from './request.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { distinctUntilChanged, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import {
  configureRequest,
  filterSuccessfulResponses,
  getResponseFromSelflink
} from '../shared/operators';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ErrorResponse, GenericSuccessResponse } from '../cache/response-cache.models';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';

export abstract class DataService<TNormalized extends NormalizedObject, TDomain> {
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract linkPath: string;
  protected abstract halService: HALEndpointService;
  protected abstract authService: AuthService;
  protected abstract notificationsService: NotificationsService;
  protected abstract http: HttpClient;

  public abstract getScopedEndpoint(scope: string): Observable<string>

  protected getFindAllHref(endpoint, options: FindAllOptions = {}): Observable<string> {
    let result: Observable<string>;
    const args = [];

    if (hasValue(options.scopeID)) {
      result = this.getScopedEndpoint(options.scopeID).distinctUntilChanged();
    } else {
      result = Observable.of(endpoint);
    }

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
      return result.map((href: string) => new URLCombiner(href, `?${args.join('&')}`).toString());
    } else {
      return result;
    }
  }

  findAll(options: FindAllOptions = {}): Observable<RemoteData<PaginatedList<TDomain>>> {
    const hrefObs = this.halService.getEndpoint(this.linkPath).filter((href: string) => isNotEmpty(href))
      .flatMap((endpoint: string) => this.getFindAllHref(endpoint, options));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
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
    const hrefObs = this.halService.getEndpoint(this.linkPath)
      .map((endpoint: string) => this.getFindByIDHref(endpoint, id));

    hrefObs
      .first((href: string) => hasValue(href))
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

  public create(dso: TDomain, parentUUID: string): Observable<RemoteData<TDomain>> {
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged()
    );

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => new CreateRequest(requestId, endpoint, this.buildFormData(dso, parentUUID))),
      configureRequest(this.requestService)
    );

    const payload$ = request$.pipe(
      take(1),
      map((request: RestRequest) => request.href),
      getResponseFromSelflink(this.responseCache),
      map((response: ResponseCacheEntry) => {
        if (!response.response.isSuccessful && response.response instanceof ErrorResponse) {
          const errorResponse: ErrorResponse = response.response;
          this.notificationsService.error('Server Error:', errorResponse.errorMessage, new NotificationOptions(-1));
        }
        return response;
      }),
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: GenericSuccessResponse<TDomain>) => response.payload),
      distinctUntilChanged()
    );

    const requestEntry$ = this.requestService.getByUUID(requestId);
    const responseCache$ = endpoint$.pipe(getResponseFromSelflink(this.responseCache));

    return this.rdbService.toRemoteDataObservable(requestEntry$, responseCache$, payload$);
  }

  public abstract buildFormData(dso: TDomain, parentUUID: string): FormData;

}
