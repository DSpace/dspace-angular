
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
   * The current URL
   * used for navigation when clicking values
   */
  currentUrl: string;

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
   * - When the value is not empty, we're browing items
   * - When the value is empty, we're browing browse-entries (values for the given metadata definition)
   */
  value = '';

  public constructor(private itemDataService: ItemDataService,
                     private route: ActivatedRoute,
                     private browseService: BrowseService) {
  }

  ngOnInit(): void {
    this.currentUrl = this.route.snapshot.pathFromRoot
      .map((snapshot) => (snapshot.routeConfig) ? snapshot.routeConfig.path : '')
      .join('/');
    this.updatePage({
      pagination: this.paginationConfig,
      sort: this.sortConfig
    });
    this.subs.push(
      observableCombineLatest(
        this.route.params,
        this.route.queryParams,
        (params, queryParams, ) => {
          return Object.assign({}, params, queryParams);
        })
        .subscribe((params) => {
          this.metadata = params.metadata || this.defaultMetadata;
          const page = +params.page || this.paginationConfig.currentPage;
          const pageSize = +params.pageSize || this.paginationConfig.pageSize;
          const sortDirection = params.sortDirection || this.sortConfig.direction;
          const sortField = params.sortField || this.sortConfig.field;
          const scope = params.scope;
          this.value = +params.value || params.value || '';
          const pagination = Object.assign({},
            this.paginationConfig,
            { currentPage: page, pageSize: pageSize }
          );
          const sort = Object.assign({},
            this.sortConfig,
            { direction: sortDirection, field: sortField }
          );
          const searchOptions = {
            metadata: this.metadata,
            pagination: pagination,
            sort: sort,
            scope: scope
          };
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
  updatePage(searchOptions) {
    this.browseEntries$ = this.browseService.getBrowseEntriesFor(searchOptions.metadata, searchOptions);
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
  updatePageWithItems(searchOptions, value: string) {
    this.items$ = this.browseService.getBrowseItemsFor(searchOptions.metadata, value, searchOptions);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
