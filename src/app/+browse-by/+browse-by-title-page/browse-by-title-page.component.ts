
import {combineLatest as observableCombineLatest,  Observable ,  Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { Item } from '../../core/shared/item.model';
import { ActivatedRoute, PRIMARY_OUTLET, UrlSegmentGroup } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
import { Collection } from '../../core/shared/collection.model';

@Component({
  selector: 'ds-browse-by-title-page',
  styleUrls: ['./browse-by-title-page.component.scss'],
  templateUrl: './browse-by-title-page.component.html'
})
/**
 * Component for browsing items by title (dc.title)
 */
export class BrowseByTitlePageComponent implements OnInit {

  items$: Observable<RemoteData<PaginatedList<Item>>>;
  paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'browse-by-title-pagination',
    currentPage: 1,
    pageSize: 20
  });
  sortConfig: SortOptions = new SortOptions('dc.title', SortDirection.ASC);
  subs: Subscription[] = [];
  currentUrl: string;

  public constructor(private itemDataService: ItemDataService, private route: ActivatedRoute) {

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
          const page = +params.page || this.paginationConfig.currentPage;
          const pageSize = +params.pageSize || this.paginationConfig.pageSize;
          const sortDirection = params.sortDirection || this.sortConfig.direction;
          const sortField = params.sortField || this.sortConfig.field;
          const scopeID = params.scope;
          const pagination = Object.assign({},
            this.paginationConfig,
            { currentPage: page, pageSize: pageSize }
          );
          const sort = Object.assign({},
            this.sortConfig,
            { direction: sortDirection, field: sortField }
          );
          this.updatePage({
            pagination: pagination,
            sort: sort,
            scopeID: scopeID
          });
        }));
  }

  /**
   * Updates the current page with searchOptions
   * @param searchOptions   Options to narrow down your search:
   *                        { pagination: PaginationComponentOptions,
   *                          sort: SortOptions }
   */
  updatePage(searchOptions) {
    this.items$ = this.itemDataService.findAll({
      currentPage: searchOptions.pagination.currentPage,
      elementsPerPage: searchOptions.pagination.pageSize,
      sort: searchOptions.sort,
      scopeID: searchOptions.scopeID
    });
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
