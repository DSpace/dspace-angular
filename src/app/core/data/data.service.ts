import { distinctUntilChanged, filter, take, first, map, flatMap } from 'rxjs/operators';
import { of as observableOf, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { FindAllOptions, FindAllRequest, FindByIDRequest, GetRequest } from './request.models';
import { RequestService } from './request.service';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { SearchParam } from '../cache/models/search-param.model';

export abstract class DataService<TNormalized extends NormalizedObject, TDomain> {
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract linkPath: string;
  protected abstract halService: HALEndpointService;
  protected abstract forceBypassCache = false;

  public abstract getBrowseEndpoint(options: FindAllOptions): Observable<string>

  protected getFindAllHref(options: FindAllOptions = {}): Observable<string> {
    let result: Observable<string>;
    const args = [];

    result = this.getBrowseEndpoint(options).pipe(distinctUntilChanged());

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

  protected getSearchByHref(endpoint, searchByLink, options: FindAllOptions = {}): Observable<string> {
    let result: Observable<string>;
    const args = [];

    result = observableOf(`${endpoint}/search/${searchByLink}`);

    if (hasValue(options.searchParams)) {
      options.searchParams.forEach((param: SearchParam) => {
        args.push(`${param.fieldName}=${param.fieldValue}`);
      })
    }

    if (hasValue(options.scopeID)) {
      args.push(`uuid=${options.scopeID}`);
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
        this.requestService.configure(request, this.forceBypassCache);
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
      first((href: string) => hasValue(href)))
      .subscribe((href: string) => {
        const request = new FindByIDRequest(this.requestService.generateRequestId(), href, id);
        this.requestService.configure(request, this.forceBypassCache);
      });

    return this.rdbService.buildSingle<TNormalized, TDomain>(hrefObs);
  }

  findByHref(href: string, options?: HttpOptions): Observable<RemoteData<TDomain>> {
    this.requestService.configure(new GetRequest(this.requestService.generateRequestId(), href, null, options), this.forceBypassCache);
    return this.rdbService.buildSingle<TNormalized, TDomain>(href);
  }

  protected searchBy(searchMethod: string, options: FindAllOptions = {}): Observable<RemoteData<PaginatedList<TDomain>>> {

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      flatMap((endpoint: string) => this.getSearchByHref(endpoint, searchMethod, options)));

    hrefObs.pipe(
      filter((href: string) => hasValue(href)),
      take(1))
      .subscribe((href: string) => {
        const request = new FindAllRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request, true);
      });

    return this.rdbService.buildList<TNormalized, TDomain>(hrefObs) as Observable<RemoteData<PaginatedList<TDomain>>>;
  }

// TODO implement, after the structure of the REST server's POST response is finalized
// create(dso: DSpaceObject): Observable<RemoteData<TDomain>> {
//   const postHrefObs = this.getEndpoint();
//
//   // TODO ID is unknown at this point
//   const idHrefObs = postHrefObs.map((href: string) => this.getFindByIDHref(href, dso.id));
//
//   postHrefObs
//     .filter((href: string) => hasValue(href))
//     .take(1)
//     .subscribe((href: string) => {
//       const request = new RestRequest(this.requestService.generateRequestId(), href, RestRequestMethod.Post, dso);
//       this.requestService.configure(request);
//     });
//
//   return this.rdbService.buildSingle<TNormalized, TDomain>(idHrefObs, this.normalizedResourceType);
// }
}
