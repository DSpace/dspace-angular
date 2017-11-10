import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchOptions } from './search-options.model';
import { SearchResult } from './search-result.model';
import { SearchService } from './search-service/search.service';
import { slideInOut } from '../shared/animations/slide';
import { HostWindowService } from '../shared/host-window.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';

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
  animations: [slideInOut]
})
export class SearchPageComponent implements OnInit, OnDestroy {

  private sub;
  private scope: string;

  query: string;
  scopeObjectRDObs: Observable<RemoteData<DSpaceObject>>;
  resultsRDObs: Observable<RemoteData<Array<SearchResult<DSpaceObject>>>>;
  currentParams = {};
  searchOptions: SearchOptions;
  scopeListRDObs: Observable<RemoteData<Community[]>>;
  isMobileView: Observable<boolean>;

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private communityService: CommunityDataService,
              private sidebarService: SearchSidebarService,
              private windowService: HostWindowService) {
    this.isMobileView = this.windowService.isXs();
    this.scopeListRDObs = communityService.findAll();
    // Initial pagination config
    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    const sort: SortOptions = new SortOptions();
    this.searchOptions = { pagination: pagination, sort: sort };
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
          const pageSize = +params.pageSize || this.searchOptions.pagination.pageSize;
          const sortDirection = +params.sortDirection || this.searchOptions.sort.direction;
          const pagination = Object.assign({},
            this.searchOptions.pagination,
            { currentPage: page, pageSize: pageSize }
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
    // Resolve search results
    this.resultsRDObs = this.service.search(this.query, this.scope, searchOptions);
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
