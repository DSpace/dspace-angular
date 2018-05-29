import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import {
  ensureArrayHasValue,
  hasValueOperator,
  isEmpty,
  isNotEmpty,
  isNotEmptyOperator
} from '../../shared/empty.util';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { SortOptions } from '../cache/models/sort-options.model';
import { GenericSuccessResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { BrowseEndpointRequest, BrowseEntriesRequest, RestRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { BrowseEntry } from '../shared/browse-entry.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  configureRequest,
  filterSuccessfulResponses,
  getRemoteDataPayload,
  getRequestFromSelflink,
  getResponseFromSelflink
} from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';

@Injectable()
export class BrowseService {
  protected linkPath = 'browses';

  private static toSearchKeyArray(metadatumKey: string): string[] {
    const keyParts = metadatumKey.split('.');
    const searchFor = [];
    searchFor.push('*');
    for (let i = 0; i < keyParts.length - 1; i++) {
      const prevParts = keyParts.slice(0, i + 1);
      const nextPart = [...prevParts, '*'].join('.');
      searchFor.push(nextPart);
    }
    searchFor.push(metadatumKey);
    return searchFor;
  }

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected halService: HALEndpointService,
    private rdb: RemoteDataBuildService,
  ) {
  }

  getBrowseDefinitions(): Observable<RemoteData<BrowseDefinition[]>> {
    const request$ = this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new BrowseEndpointRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService)
    );

    const href$ = request$.pipe(map((request: RestRequest) => request.href));
    const requestEntry$ = href$.pipe(getRequestFromSelflink(this.requestService));
    const responseCache$ = href$.pipe(getResponseFromSelflink(this.responseCache));
    const payload$ = responseCache$.pipe(
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: GenericSuccessResponse<BrowseDefinition[]>) => response.payload),
      ensureArrayHasValue(),
      distinctUntilChanged()
    );

    return this.rdb.toRemoteDataObservable(requestEntry$, responseCache$, payload$);
  }

  getBrowseEntriesFor(definitionID: string, options: {
    pagination?: PaginationComponentOptions;
    sort?: SortOptions;
  } = {}): Observable<RemoteData<PaginatedList<BrowseEntry>>> {
    const request$ = this.getBrowseDefinitions().pipe(
      getRemoteDataPayload(),
      map((browseDefinitions: BrowseDefinition[]) => browseDefinitions
        .find((def: BrowseDefinition) => def.id === definitionID && def.metadataBrowse === true)
      ),
      map((def: BrowseDefinition) => {
        if (isNotEmpty(def)) {
          return def._links;
        } else {
          throw new Error(`No metadata browse definition could be found for id '${definitionID}'`);
        }
      }),
      hasValueOperator(),
      map((_links: any) => _links.entries),
      hasValueOperator(),
      map((href: string) => {
        // TODO nearly identical to PaginatedSearchOptions => refactor
        const args = [];
        if (isNotEmpty(options.sort)) {
          args.push(`sort=${options.sort.field},${options.sort.direction}`);
        }
        if (isNotEmpty(options.pagination)) {
          args.push(`page=${options.pagination.currentPage - 1}`);
          args.push(`size=${options.pagination.pageSize}`);
        }
        if (isNotEmpty(args)) {
          href = new URLCombiner(href, `?${args.join('&')}`).toString();
        }
        return href;
      }),
      map((endpointURL: string) => new BrowseEntriesRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService)
    );

    const href$ = request$.pipe(map((request: RestRequest) => request.href));

    const requestEntry$ = href$.pipe(getRequestFromSelflink(this.requestService));
    const responseCache$ = href$.pipe(getResponseFromSelflink(this.responseCache));

    const payload$ = responseCache$.pipe(
      filterSuccessfulResponses(),
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: GenericSuccessResponse<BrowseEntry[]>) => new PaginatedList(response.pageInfo, response.payload)),
      distinctUntilChanged()
    );

    return this.rdb.toRemoteDataObservable(requestEntry$, responseCache$, payload$);
  }

  getBrowseURLFor(metadatumKey: string, linkPath: string): Observable<string> {
    const searchKeyArray = BrowseService.toSearchKeyArray(metadatumKey);
    return this.getBrowseDefinitions().pipe(
      getRemoteDataPayload(),
      map((browseDefinitions: BrowseDefinition[]) => browseDefinitions
        .find((def: BrowseDefinition) => {
          const matchingKeys = def.metadataKeys.find((key: string) => searchKeyArray.indexOf(key) >= 0);
          return isNotEmpty(matchingKeys);
        })
      ),
      map((def: BrowseDefinition) => {
        if (isEmpty(def) || isEmpty(def._links) || isEmpty(def._links[linkPath])) {
          throw new Error(`A browse endpoint for ${linkPath} on ${metadatumKey} isn't configured`);
        } else {
          return def._links[linkPath];
        }
      }),
      startWith(undefined),
      distinctUntilChanged()
    );
  }

}
