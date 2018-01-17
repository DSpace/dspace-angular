import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GlobalConfig } from '../../../config';
import { hasNoValue, hasValue, isNotEmpty } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteData } from './remote-data';
import { FindAllOptions, FindAllRequest, FindByIDRequest, RestRequest } from './request.models';
import { RequestService } from './request.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { compareEquatables } from '../shared/equatable.mixin';

export abstract class DataService<TNormalized extends CacheableObject, TDomain> extends HALEndpointService {
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract linkName: string;
  protected abstract EnvConfig: GlobalConfig;

  constructor(
    protected normalizedResourceType: GenericConstructor<TNormalized>,
  ) {
    super();
  }

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
      let direction = 'asc';
      if (options.sort.direction === 1) {
        direction = 'desc';
      }
      args.push(`sort=${options.sort.field},${direction}`);
    }

    if (isNotEmpty(args)) {
      return result.map((href: string) => new URLCombiner(href, `?${args.join('&')}`).toString());
    } else {
      return result;
    }
  }

  findAll(options: FindAllOptions = {}): Observable<RemoteData<TDomain[]>> {
    const hrefObs = this.getEndpoint().filter((href: string) => isNotEmpty(href))
      .flatMap((endpoint: string) => this.getFindAllHref(endpoint, options));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new FindAllRequest(href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<TNormalized, TDomain>(hrefObs, this.normalizedResourceType)
      .distinctUntilChanged(compareEquatables)

  }

  getFindByIDHref(endpoint, resourceID): string {
    return `${endpoint}/${resourceID}`;
  }

  findById(id: string): Observable<RemoteData<TDomain>> {
    const hrefObs = this.getEndpoint()
      .map((endpoint: string) => this.getFindByIDHref(endpoint, id));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new FindByIDRequest(href, id);
        this.requestService.configure(request);
      });

    return this.rdbService.buildSingle<TNormalized, TDomain>(hrefObs, this.normalizedResourceType)
      .distinctUntilChanged(compareEquatables);
  }

  findByHref(href: string): Observable<RemoteData<TDomain>> {
    this.requestService.configure(new RestRequest(href));
    return this.rdbService.buildSingle<TNormalized, TDomain>(href, this.normalizedResourceType)
      .distinctUntilChanged(compareEquatables);
  }

}
