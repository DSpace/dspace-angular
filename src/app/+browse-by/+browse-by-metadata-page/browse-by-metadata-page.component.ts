import {combineLatest as observableCombineLatest, merge as observableMerge, Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { BrowseService } from '../../core/browse/browse.service';
import { BrowseEntry } from '../../core/shared/browse-entry.model';
import { Item } from '../../core/shared/item.model';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { take } from 'rxjs/operators';
import { StartsWithType } from '../../shared/starts-with/starts-with-decorator';
import { BrowseByType, rendersBrowseBy } from '../+browse-by-switcher/browse-by-decorator';

@Component({
  selector: 'ds-browse-by-metadata-page',
  styleUrls: ['./browse-by-metadata-page.component.scss'],
  templateUrl: './browse-by-metadata-page.component.html'
})
/**
 * Component for browsing (items) by metadata definition
 * A metadata definition (a.k.a. browse id) is a short term used to describe one or multiple metadata fields.
 * An example would be 'author' for 'dc.contributor.*'
 */
@rendersBrowseBy(BrowseByType.Metadata)
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
   * The current Community or Collection we're browsing metadata/items in
   */
  parent$: Observable<RemoteData<DSpaceObject>>;

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
   * The default browse id to resort to when none is provided
   */
  defaultBrowseId = 'author';

  /**
   * The current browse id
   */
  browseId = this.defaultBrowseId;

  /**
   * The type of StartsWith options to render
   * Defaults to text
   */
  startsWithType = StartsWithType.text;

  /**
   * The list of StartsWith options
   * Should be defined after ngOnInit is called!
   */
  startsWithOptions;

  /**
   * The value we're browing items for
   * - When the value is not empty, we're browsing items
   * - When the value is empty, we're browsing browse-entries (values for the given metadata definition)
   */
  value = '';

  /**
   * The current startsWith option (fetched and updated from query-params)
   */
  startsWith: string;

  public constructor(protected route: ActivatedRoute,
                     protected browseService: BrowseService,
                     protected dsoService: DSpaceObjectDataService,
                     protected router: Router) {
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
          this.browseId = params.id || this.defaultBrowseId;
          this.value = +params.value || params.value || '';
          this.startsWith = +params.startsWith || params.startsWith;
          const searchOptions = browseParamsToOptions(params, this.paginationConfig, this.sortConfig, this.browseId);
          if (isNotEmpty(this.value)) {
            this.updatePageWithItems(searchOptions, this.value);
          } else {
            this.updatePage(searchOptions);
          }
          this.updateParent(params.scope);
        }));
    this.updateStartsWithTextOptions();
  }

  /**
   * Update the StartsWith options with text values
   * It adds the value "0-9" as well as all letters from A to Z
   */
  updateStartsWithTextOptions() {
    this.startsWithOptions = ['0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
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

  /**
   * Update the parent Community or Collection using their scope
   * @param scope   The UUID of the Community or Collection to fetch
   */
  updateParent(scope: string) {
    if (hasValue(scope)) {
      this.parent$ = this.dsoService.findById(scope).pipe(
        getSucceededRemoteData()
      );
    }
  }

  /**
   * Navigate to the previous page
   */
  goPrev() {
    if (this.items$) {
      this.items$.pipe(take(1)).subscribe((items) => {
        this.items$ = this.browseService.getPrevBrowseItems(items);
      });
    } else if (this.browseEntries$) {
      this.browseEntries$.pipe(take(1)).subscribe((entries) => {
        this.browseEntries$ = this.browseService.getPrevBrowseEntries(entries);
      });
    }
  }

  /**
   * Navigate to the next page
   */
  goNext() {
    if (this.items$) {
      this.items$.pipe(take(1)).subscribe((items) => {
        this.items$ = this.browseService.getNextBrowseItems(items);
      });
    } else if (this.browseEntries$) {
      this.browseEntries$.pipe(take(1)).subscribe((entries) => {
        this.browseEntries$ = this.browseService.getNextBrowseEntries(entries);
      });
    }
  }

  /**
   * Change the page size
   * @param size
   */
  pageSizeChange(size) {
    this.router.navigate([], {
      queryParams: Object.assign({ pageSize: size }),
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Change the sorting direction
   * @param direction
   */
  sortDirectionChange(direction) {
    this.router.navigate([], {
      queryParams: Object.assign({ sortDirection: direction }),
      queryParamsHandling: 'merge'
    });
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
    +params.startsWith || params.startsWith,
    params.scope
  );
}
