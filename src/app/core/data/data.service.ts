import { ResponseCacheService } from '../cache/response-cache.service';
import { CacheableObject } from '../cache/object-cache.reducer';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { RemoteData } from './remote-data';
import {
  FindAllOptions, FindAllRequest, FindByIDRequest, RestRequest,
  RootEndpointRequest
} from './request.models';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { GlobalConfig } from '../../../config';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { Observable } from 'rxjs/Observable';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { RootSuccessResponse } from '../cache/response-cache.models';

export abstract class DataService<TNormalized extends CacheableObject, TDomain> {
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract linkName: string;
  protected abstract browseEndpoint: string;

  constructor(
    private normalizedResourceType: GenericConstructor<TNormalized>,
    protected EnvConfig: GlobalConfig
  ) {

  }

  private getEndpoint(linkName: string): Observable<string> {
    const request = new RootEndpointRequest(this.EnvConfig);
    this.requestService.configure(request);
    return this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .filter((response: RootSuccessResponse) => isNotEmpty(response) && isNotEmpty(response.endpointMap))
      .map((response: RootSuccessResponse) => response.endpointMap[linkName])
  }

  protected getFindAllHref(endpoint, options: FindAllOptions = {}): string {
    let result;
    const args = [];

    if (hasValue(options.scopeID)) {
      result = new RESTURLCombiner(this.EnvConfig, this.browseEndpoint).toString();
      args.push(`scope=${options.scopeID}`);
    } else {
      result = endpoint;
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
      result = `${result}?${args.join('&')}`;
    }
    return result;
  }

  findAll(options: FindAllOptions = {}): RemoteData<TDomain[]> {
    const hrefObs = this.getEndpoint(this.linkName)
      .map((endpoint: string) => this.getFindAllHref(endpoint, options));

    hrefObs
      .subscribe((href: string) => {
        const request = new FindAllRequest(href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<TNormalized, TDomain>(hrefObs, this.normalizedResourceType);
  }

  protected getFindByIDHref(endpoint, resourceID): string {
    return `${endpoint}/${resourceID}`;
  }

  findById(id: string): RemoteData<TDomain> {
    const hrefObs = this.getEndpoint(this.linkName)
      .map((endpoint: string) => this.getFindByIDHref(endpoint, id));

    hrefObs
      .subscribe((href: string) => {
        const request = new FindByIDRequest(href, id);
        this.requestService.configure(request);
      });

    return this.rdbService.buildSingle<TNormalized, TDomain>(hrefObs, this.normalizedResourceType);
  }

  findByHref(href: string): RemoteData<TDomain> {
    this.requestService.configure(new RestRequest(href));
    return this.rdbService.buildSingle<TNormalized, TDomain>(href, this.normalizedResourceType);
    // return this.rdbService.buildSingle(href));
  }

}
