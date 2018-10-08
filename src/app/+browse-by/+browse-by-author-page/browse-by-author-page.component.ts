import { Component, OnInit } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { ItemDataService } from '../../core/data/item-data.service';
import { Observable, Subscription } from 'rxjs';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute } from '@angular/router';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { BrowseService } from '../../core/browse/browse.service';
import { BrowseEntry } from '../../core/shared/browse-entry.model';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-browse-by-author-page',
  styleUrls: ['./browse-by-author-page.component.scss'],
  templateUrl: './browse-by-author-page.component.html'
})
/**
 * Component for browsing (items) by author (dc.contributor.author)
 */
export class BrowseByAuthorPageComponent implements OnInit {

  authors$: Observable<RemoteData<PaginatedList<BrowseEntry>>>;
  items$: Observable<RemoteData<PaginatedList<Item>>>;
  paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'browse-by-author-pagination',
    currentPage: 1,
    pageSize: 20
  });
  sortConfig: SortOptions = new SortOptions('dc.contributor.author', SortDirection.ASC);
  subs: Subscription[] = [];
  currentUrl: string;
  value = '';

  public constructor(private itemDataService: ItemDataService, private route: ActivatedRoute, private browseService: BrowseService) {
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
      Observable.combineLatest(
        this.route.params,
        this.route.queryParams,
        (params, queryParams, ) => {
          return Object.assign({}, params, queryParams);
        })
        .subscribe((params) => {
          const page = +params.page || this.paginationConfig.currentPage;
          const pageSize = +params.pageSize || this.paginationConfig.pageSize;
          const sortDirection = params.sortDirection || this.sortConfig.direction;
          const sortField = params.sortField || this.sortConfig.field;
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
            pagination: pagination,
            sort: sort
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
   *                        { pagination: PaginationComponentOptions,
   *                          sort: SortOptions }
   */
  updatePage(searchOptions) {
    this.authors$ = this.browseService.getBrowseEntriesFor('author', searchOptions);
    this.items$ = undefined;
  }

  /**
   * Updates the current page with searchOptions and display items linked to author
   * @param searchOptions   Options to narrow down your search:
   *                        { pagination: PaginationComponentOptions,
   *                          sort: SortOptions }
   * @param author          The author's name for displaying items
   */
  updatePageWithItems(searchOptions, author: string) {
    this.items$ = this.browseService.getBrowseItemsFor('author', author, searchOptions);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
