import { filter, find, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { FindAllOptions, FindAllRequest, FindByIDRequest, GetRequest } from './request.models';
import { RequestService } from './request.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { compare, Operation } from 'fast-json-patch';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceObject } from '../shared/dspace-object.model';

export abstract class DataService<TNormalized extends NormalizedObject, TDomain> {
  protected abstract requestService: RequestService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract store: Store<CoreState>;
  protected abstract linkPath: string;
  protected abstract halService: HALEndpointService;
  protected abstract objectCache: ObjectCacheService;

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
  update(object: DSpaceObject) {
    const oldVersion = this.objectCache.getBySelfLink(object.self);
    const operations = compare(oldVersion, object);
    if (isNotEmpty(operations)) {
      this.objectCache.addPatch(object.self, operations);
    }
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
  //       const request = new RestRequest(this.requestService.generateRequestId(), href, RestRequestMethod.POST, dso);
  //       this.requestService.configure(request);
  //     });
  //
  //   return this.rdbService.buildSingle<TNormalized, TDomain>(idHrefObs, this.normalizedResourceType);
  // }
}
