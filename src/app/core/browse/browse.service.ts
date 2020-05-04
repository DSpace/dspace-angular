import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import {
  ensureArrayHasValue,
  hasValue,
  hasValueOperator,
  isEmpty,
  isNotEmpty,
  isNotEmptyOperator
} from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GenericSuccessResponse } from '../cache/response.models';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { BrowseEndpointRequest, BrowseEntriesRequest, BrowseItemsRequest, RestRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { BrowseEntry } from '../shared/browse-entry.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import {
  configureRequest,
  filterSuccessfulResponses,
  getBrowseDefinitionLinks,
  getFirstOccurrence,
  getRemoteDataPayload,
  getRequestFromRequestHref
} from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';
import { BrowseEntrySearchOptions } from './browse-entry-search-options.model';

/**
 * The service handling all browse requests
 */
@Injectable()
export class BrowseService {
  protected linkPath = 'browses';

  private static toSearchKeyArray(metadataKey: string): string[] {
    const keyParts = metadataKey.split('.');
    const searchFor = [];
    searchFor.push('*');
    for (let i = 0; i < keyParts.length - 1; i++) {
      const prevParts = keyParts.slice(0, i + 1);
      const nextPart = [...prevParts, '*'].join('.');
      searchFor.push(nextPart);
    }
    searchFor.push(metadataKey);
    return searchFor;
  }

  constructor(
    protected requestService: RequestService,
    protected halService: HALEndpointService,
    private rdb: RemoteDataBuildService,
  ) {
  }

  /**
   * Get all BrowseDefinitions
   */
  getBrowseDefinitions(): Observable<RemoteData<BrowseDefinition[]>> {
    const request$ = this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new BrowseEndpointRequest(this.requestService.generateRequestId(), endpointURL)),
      configureRequest(this.requestService)
    );

    const href$ = request$.pipe(map((request: RestRequest) => request.href));
    const requestEntry$ = href$.pipe(getRequestFromRequestHref(this.requestService));
    const payload$ = requestEntry$.pipe(
      filterSuccessfulResponses(),
      map((response: GenericSuccessResponse<BrowseDefinition[]>) => response.payload),
      ensureArrayHasValue(),
      map((definitions: BrowseDefinition[]) => definitions
        .map((definition: BrowseDefinition) => {
          return Object.assign(new BrowseDefinition(), definition)
        })),
      distinctUntilChanged(),
    );
    return this.rdb.toRemoteDataObservable(requestEntry$, payload$);
  }

  /**
   * Get all BrowseEntries filtered or modified by BrowseEntrySearchOptions
   * @param options
   */
  getBrowseEntriesFor(options: BrowseEntrySearchOptions): Observable<RemoteData<PaginatedList<BrowseEntry>>> {
    return this.getBrowseDefinitions().pipe(
      getBrowseDefinitionLinks(options.metadataDefinition),
      hasValueOperator(),
      map((_links: any) => {
        const entriesLink = _links.entries.href || _links.entries;
        return entriesLink;
      }),
      hasValueOperator(),
      map((href: string) => {
        // TODO nearly identical to PaginatedSearchOptions => refactor
        const args = [];
        if (isNotEmpty(options.scope)) {
          args.push(`scope=${options.scope}`);
        }
        if (isNotEmpty(options.sort)) {
          args.push(`sort=${options.sort.field},${options.sort.direction}`);
        }
        if (isNotEmpty(options.pagination)) {
          args.push(`page=${options.pagination.currentPage - 1}`);
          args.push(`size=${options.pagination.pageSize}`);
        }
        if (isNotEmpty(options.startsWith)) {
          args.push(`startsWith=${options.startsWith}`);
        }
        if (isNotEmpty(args)) {
          href = new URLCombiner(href, `?${args.join('&')}`).toString();
        }
        return href;
      }),
      getBrowseEntriesFor(this.requestService, this.rdb)
    );
  }

  /**
   * Get all items linked to a certain metadata value
   * @param {string} filterValue      metadata value to filter by (e.g. author's name)
   * @param options                   Options to narrow down your search
   * @returns {Observable<RemoteData<PaginatedList<Item>>>}
   */
  getBrowseItemsFor(filterValue: string, options: BrowseEntrySearchOptions): Observable<RemoteData<PaginatedList<Item>>> {
    return this.getBrowseDefinitions().pipe(
      getBrowseDefinitionLinks(options.metadataDefinition),
      hasValueOperator(),
      map((_links: any) => {
        const itemsLink = _links.items.href || _links.items;
        return itemsLink;
      }),
      hasValueOperator(),
      map((href: string) => {
        const args = [];
        if (isNotEmpty(options.scope)) {
          args.push(`scope=${options.scope}`);
        }
        if (isNotEmpty(options.sort)) {
          args.push(`sort=${options.sort.field},${options.sort.direction}`);
        }
        if (isNotEmpty(options.pagination)) {
          args.push(`page=${options.pagination.currentPage - 1}`);
          args.push(`size=${options.pagination.pageSize}`);
        }
        if (isNotEmpty(options.startsWith)) {
          args.push(`startsWith=${options.startsWith}`);
        }
        if (isNotEmpty(filterValue)) {
          args.push(`filterValue=${filterValue}`);
        }
        if (isNotEmpty(args)) {
          href = new URLCombiner(href, `?${args.join('&')}`).toString();
        }
        return href;
      }),
      getBrowseItemsFor(this.requestService, this.rdb)
    );
  }

  /**
   * Get the first item for a metadata definition in an optional scope
   * @param definition
   * @param scope
   */
  getFirstItemFor(definition: string, scope?: string): Observable<RemoteData<Item>> {
    return this.getBrowseDefinitions().pipe(
      getBrowseDefinitionLinks(definition),
      hasValueOperator(),
      map((_links: any) => {
        const itemsLink = _links.items.href || _links.items;
        return itemsLink;
      }),
      hasValueOperator(),
      map((href: string) => {
        const args = [];
        if (hasValue(scope)) {
          args.push(`scope=${scope}`);
        }
        args.push('page=0');
        args.push('size=1');
        if (isNotEmpty(args)) {
          href = new URLCombiner(href, `?${args.join('&')}`).toString();
        }
        return href;
      }),
      getBrowseItemsFor(this.requestService, this.rdb),
      getFirstOccurrence()
    );
  }

  /**
   * Get the previous page of items using the paginated list's prev link
   * @param items
   */
  getPrevBrowseItems(items: RemoteData<PaginatedList<Item>>): Observable<RemoteData<PaginatedList<Item>>> {
    return observableOf(items.payload.prev).pipe(
      getBrowseItemsFor(this.requestService, this.rdb)
    );
  }

  /**
   * Get the next page of items using the paginated list's next link
   * @param items
   */
  getNextBrowseItems(items: RemoteData<PaginatedList<Item>>): Observable<RemoteData<PaginatedList<Item>>> {
    return observableOf(items.payload.next).pipe(
      getBrowseItemsFor(this.requestService, this.rdb)
    );
  }

  /**
   * Get the previous page of browse-entries using the paginated list's prev link
   * @param entries
   */
  getPrevBrowseEntries(entries: RemoteData<PaginatedList<BrowseEntry>>): Observable<RemoteData<PaginatedList<BrowseEntry>>> {
    return observableOf(entries.payload.prev).pipe(
      getBrowseEntriesFor(this.requestService, this.rdb)
    );
  }

  /**
   * Get the next page of browse-entries using the paginated list's next link
   * @param entries
   */
  getNextBrowseEntries(entries: RemoteData<PaginatedList<BrowseEntry>>): Observable<RemoteData<PaginatedList<BrowseEntry>>> {
    return observableOf(entries.payload.next).pipe(
      getBrowseEntriesFor(this.requestService, this.rdb)
    );
  }

  /**
   * Get the browse URL by providing a metadatum key and linkPath
   * @param metadatumKey
   * @param linkPath
   */
  getBrowseURLFor(metadataKey: string, linkPath: string): Observable<string> {
    const searchKeyArray = BrowseService.toSearchKeyArray(metadataKey);
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
          throw new Error(`A browse endpoint for ${linkPath} on ${metadataKey} isn't configured`);
        } else {
          return def._links[linkPath] || def._links[linkPath].href;
        }
      }),
      startWith(undefined),
      distinctUntilChanged()
    );
  }

}

/**
 * Operator for turning a href into a PaginatedList of BrowseEntries
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export const getBrowseEntriesFor = (requestService: RequestService, rdb: RemoteDataBuildService) =>
  (source: Observable<string>): Observable<RemoteData<PaginatedList<BrowseEntry>>> =>
    source.pipe(
      map((href: string) => new BrowseEntriesRequest(requestService.generateRequestId(), href)),
      configureRequest(requestService),
      toRDPaginatedBrowseEntries(requestService, rdb)
    );

/**
 * Operator for turning a href into a PaginatedList of Items
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export const getBrowseItemsFor = (requestService: RequestService, rdb: RemoteDataBuildService) =>
  (source: Observable<string>): Observable<RemoteData<PaginatedList<Item>>> =>
    source.pipe(
      map((href: string) => new BrowseItemsRequest(requestService.generateRequestId(), href)),
      configureRequest(requestService),
      toRDPaginatedBrowseItems(requestService, rdb)
    );

/**
 * Operator for turning a RestRequest into a PaginatedList of Items
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export const toRDPaginatedBrowseItems = (requestService: RequestService, rdb: RemoteDataBuildService) =>
  (source: Observable<RestRequest>): Observable<RemoteData<PaginatedList<Item>>> => {
    const href$ = source.pipe(map((request: RestRequest) => request.href));

    const requestEntry$ = href$.pipe(getRequestFromRequestHref(requestService));

    const payload$ = requestEntry$.pipe(
      filterSuccessfulResponses(),
      map((response: GenericSuccessResponse<Item[]>) => new PaginatedList(response.pageInfo, response.payload)),
      map((list: PaginatedList<Item>) => Object.assign(list, {
        page: list.page ? list.page.map((item: DSpaceObject) => Object.assign(new Item(), item)) : list.page
      })),
      distinctUntilChanged()
    );

    return rdb.toRemoteDataObservable(requestEntry$, payload$);
  };

/**
 * Operator for turning a RestRequest into a PaginatedList of BrowseEntries
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export const toRDPaginatedBrowseEntries = (requestService: RequestService, rdb: RemoteDataBuildService) =>
  (source: Observable<RestRequest>): Observable<RemoteData<PaginatedList<BrowseEntry>>> => {
    const href$ = source.pipe(map((request: RestRequest) => request.href));

    const requestEntry$ = href$.pipe(getRequestFromRequestHref(requestService));

    const payload$ = requestEntry$.pipe(
      filterSuccessfulResponses(),
      map((response: GenericSuccessResponse<BrowseEntry[]>) => new PaginatedList(response.pageInfo, response.payload)),
      map((list: PaginatedList<BrowseEntry>) => Object.assign(list, {
        page: list.page ? list.page.map((entry: BrowseEntry) => Object.assign(new BrowseEntry(), entry)) : list.page
      })),
      distinctUntilChanged()
    );

    return rdb.toRemoteDataObservable(requestEntry$, payload$);
  };
