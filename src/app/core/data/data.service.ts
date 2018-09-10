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
  PostRequest,
  RestRequest
} from './request.models';
import { RequestService } from './request.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { distinctUntilChanged, map, share, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  configureRequest,
  filterSuccessfulResponses, getRequestFromSelflink,
  getResponseFromSelflink
} from '../shared/operators';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HttpHeaders } from '@angular/common/http';
import { DSOSuccessResponse, SingleDSOSuccessResponse } from '../cache/response-cache.models';
import { AuthService } from '../auth/auth.service';
import { DSpaceObject } from '../shared/dspace-object.model';

export abstract class DataService<TNormalized extends NormalizedObject, TDomain> {
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract linkPath: string;
  protected abstract halService: HALEndpointService;
  protected abstract authService: AuthService;

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

  public create(dso: TDomain): Observable<RemoteData<DSpaceObject>> {
    const request$ = this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      withLatestFrom(this.buildCreateParams(dso)),
      map(([endpointURL, params]) => {
        const options: HttpOptions = Object.create({});
        const headers = new HttpHeaders();
        headers.append('Authentication', this.authService.buildAuthHeader());
        options.headers = headers;
        return new CreateRequest(this.requestService.generateRequestId(), endpointURL + params, options);
      }),
      configureRequest(this.requestService),
      share()
    );

    const href$ = request$.pipe(map((request: RestRequest) => request.href));
    const requestEntry$ = href$.pipe(getRequestFromSelflink(this.requestService));
    const responseCache$ = href$.pipe(getResponseFromSelflink(this.responseCache));

    const payload$ = responseCache$.pipe(
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: SingleDSOSuccessResponse) => response.dso),
      distinctUntilChanged()
    );

    return this.rdbService.toRemoteDataObservable(requestEntry$, responseCache$, payload$);
  }

  public abstract buildCreateParams(dso: TDomain): Observable<string>;

}
