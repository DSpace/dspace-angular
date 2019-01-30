
import {combineLatest as observableCombineLatest,  Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute } from '@angular/router';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { BrowseService } from '../../core/browse/browse.service';
import { BrowseEntry } from '../../core/shared/browse-entry.model';
import { Item } from '../../core/shared/item.model';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';

@Component({
  selector: 'ds-browse-by-metadata-page',
  styleUrls: ['./browse-by-metadata-page.component.scss'],
  templateUrl: './browse-by-metadata-page.component.html'
})
/**
 * Component for browsing (items) by metadata definition
 * A metadata definition is a short term used to describe one or multiple metadata fields.
 * An example would be 'author' for 'dc.contributor.*'
 */
export class BrowseByMetadataPageComponent implements OnInit {

  /**
   * The list of browse-entries to display
   */
  browseEntries$: Observable<RemoteData<PaginatedList<BrowseEntry>>>;

  /**
   * The list of items to display when a value is present
   */
  items$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The pagination config used to display the values
   */
  paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'browse-by-metadata-pagination',
    currentPage: 1,
    pageSize: 20
  });

  /**
   * The sorting config used to sort the values (defaults to Ascending)
   */
  sortConfig: SortOptions = new SortOptions('default', SortDirection.ASC);

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * The default metadata definition to resort to when none is provided
   */
  defaultMetadata = 'author';

  /**
   * The current metadata definition
   */
  metadata = this.defaultMetadata;

  /**
   * The value we're browing items for
   * - When the value is not empty, we're browsing items
   * - When the value is empty, we're browsing browse-entries (values for the given metadata definition)
   */
  value = '';

  public constructor(private itemDataService: ItemDataService,
                     private route: ActivatedRoute,
                     private browseService: BrowseService) {
  }

  ngOnInit(): void {
    this.updatePage(new BrowseEntrySearchOptions(null, this.paginationConfig, this.sortConfig));
    this.subs.push(
      observableCombineLatest(
        this.route.params,
        this.route.queryParams,
        (params, queryParams, ) => {
          return Object.assign({}, params, queryParams);
        })
        .subscribe((params) => {
          this.metadata = params.metadata || this.defaultMetadata;
          this.value = +params.value || params.value || '';
          const searchOptions = browseParamsToOptions(params, this.paginationConfig, this.sortConfig, this.metadata);
          if (isNotEmpty(this.value)) {
            this.updatePageWithItems(searchOptions, this.value);
          } else {
            this.updatePage(searchOptions);
          }
        }));
  }

  /**
   * Updates the current page with searchOptions
   * @param searchOptions   Options to narrow down your search:
   *                        { metadata: string
   *                          pagination: PaginationComponentOptions,
   *                          sort: SortOptions,
   *                          scope: string }
   */
  updatePage(searchOptions: BrowseEntrySearchOptions) {
    this.browseEntries$ = this.browseService.getBrowseEntriesFor(searchOptions);
    this.items$ = undefined;
  }

  /**
   * Updates the current page with searchOptions and display items linked to the given value
   * @param searchOptions   Options to narrow down your search:
   *                        { metadata: string
   *                          pagination: PaginationComponentOptions,
   *                          sort: SortOptions,
   *                          scope: string }
   * @param value          The value of the browse-entry to display items for
   */
  updatePageWithItems(searchOptions: BrowseEntrySearchOptions, value: string) {
    this.items$ = this.browseService.getBrowseItemsFor(value, searchOptions);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}

/**
 * Function to transform query and url parameters into searchOptions used to fetch browse entries or items
 * @param params            URL and query parameters
 * @param paginationConfig  Pagination configuration
 * @param sortConfig        Sorting configuration
 * @param metadata          Optional metadata definition to fetch browse entries/items for
 */
export function browseParamsToOptions(params: any,
                                      paginationConfig: PaginationComponentOptions,
                                      sortConfig: SortOptions,
                                      metadata?: string): BrowseEntrySearchOptions {
  return new BrowseEntrySearchOptions(
    metadata,
    Object.assign({},
      paginationConfig,
      {
        currentPage: +params.page || paginationConfig.currentPage,
        pageSize: +params.pageSize || paginationConfig.pageSize
      }
    ),
    Object.assign({},
      sortConfig,
      {
        direction: params.sortDirection || sortConfig.direction,
        field: params.sortField || sortConfig.field
      }
    ),
    params.scope
  );
}
