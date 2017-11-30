import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommunityDataService } from '../core/data/community-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { isNotEmpty } from '../shared/empty.util';
import { SearchOptions,ViewMode } from './search-options.model';
import { SearchResult } from './search-result.model';
import { SearchService } from './search-service/search.service';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { SortOptions } from '../core/cache/models/sort-options.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-page',
  styleUrls: ['./search-page.component.scss'],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut]
})
export class SearchPageComponent implements OnInit, OnDestroy {

  private sub;
  private scope: string;

  query: string;
  scopeObjectRDObs: Observable<RemoteData<DSpaceObject>>;
  resultsRDObs: Observable<RemoteData<Array<SearchResult<DSpaceObject>>>>;
  currentParams = {};
  searchOptions: SearchOptions;
  sortConfig: SortOptions;
  scopeListRDObs: Observable<RemoteData<Community[]>>;
  isMobileView: Observable<boolean>;

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private communityService: CommunityDataService,
              private sidebarService: SearchSidebarService,
              private windowService: HostWindowService) {
    this.isMobileView =  Observable.combineLatest(
      this.windowService.isXs(),
      this.windowService.isSm(),
      ((isXs, isSm) => isXs || isSm)
    );
    this.scopeListRDObs = communityService.findAll();
    // Initial pagination config
    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;

    const sort: SortOptions = new SortOptions();
    this.sortConfig = sort;
    this.searchOptions = this.service.searchOptions;
  }

  ngOnInit(): void {
    this.sub = this.route
      .queryParams
      .subscribe((params) => {
          // Save current parameters
          this.currentParams = params;
          this.query = params.query || '';
          this.scope = params.scope;
          const page = +params.page || this.searchOptions.pagination.currentPage;
          let pageSize = +params.pageSize || this.searchOptions.pagination.pageSize;
          let pageSizeOptions: number[] = [5, 10, 20, 40, 60, 80, 100];

          if (isNotEmpty(params.view) && params.view === ViewMode.Grid) {
            pageSize = 12;
            pageSizeOptions = [12, 24, 36, 48 , 50, 62, 74, 84];
            // pageSize = 9;
            // pageSizeOptions = [9, 18, 27, 36 , 45, 54, 63, 72];
          }

          const sortDirection = +params.sortDirection || this.searchOptions.sort.direction;
          const pagination = Object.assign({},
            this.searchOptions.pagination,
            { currentPage: page, pageSize: pageSize, pageSizeOptions: pageSizeOptions}
          );
          const sort = Object.assign({},
            this.searchOptions.sort,
            { direction: sortDirection, field: params.sortField }
          );

          this.updateSearchResults({
            pagination: pagination,
            sort: sort
          });
          if (isNotEmpty(this.scope)) {
            this.scopeObjectRDObs = this.communityService.findById(this.scope);
          } else {
            this.scopeObjectRDObs = Observable.of(undefined);
          }
        }
      );
  }

  private updateSearchResults(searchOptions) {
    this.resultsRDObs = this.service.search(this.query, this.scope, searchOptions);
    this.searchOptions = searchOptions;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public closeSidebar(): void {
    this.sidebarService.collapse()
  }

  public openSidebar(): void {
    this.sidebarService.expand();
  }

  public isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }
}
