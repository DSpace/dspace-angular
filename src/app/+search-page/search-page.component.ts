import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './search-service/search.service';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { SearchResult } from './search-result.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchOptions } from './search-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { isNotEmpty } from '../shared/empty.util';
import { Community } from '../core/shared/community.model';
import { createSelector, Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Observable } from 'rxjs/Observable';
import { SearchSidebarState } from './search-sidebar/search-sidebar.reducer';
import { SearchSidebarToggleAction } from './search-sidebar/search-sidebar.actions';
import { slideInOut } from '../shared/animations/slide';
import { HostWindowService } from '../shared/host-window.service';

const sidebarStateSelector = (state: AppState) => state.searchSidebar;
const sidebarCollapsedSelector = createSelector(sidebarStateSelector, (sidebar: SearchSidebarState) => sidebar.sidebarCollapsed);

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-page',
  styleUrls: ['./search-page.component.scss'],
  templateUrl: './search-page.component.html',
  animations: [slideInOut]
})
export class SearchPageComponent implements OnInit, OnDestroy {

  private sub;
  private scope: string;

  query: string;
  scopeObject: RemoteData<DSpaceObject>;
  results: RemoteData<Array<SearchResult<DSpaceObject>>>;
  currentParams = {};
  searchOptions: SearchOptions;
  scopeList: RemoteData<Community[]>;
  isSidebarCollapsed: Observable<boolean>;
  isMobileView: Observable<boolean>;

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private communityService: CommunityDataService,
              private store: Store<AppState>,
              private hostWindowService: HostWindowService) {
    this.scopeList = communityService.findAll();
    // Initial pagination config
    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    const sort: SortOptions = new SortOptions();
    this.searchOptions = { pagination: pagination, sort: sort };
    this.isMobileView = Observable.combineLatest(
      this.hostWindowService.isXs(),
      this.hostWindowService.isSm(),
      (isXs, isSm) => isXs || isSm);
  }

  ngOnInit(): void {
    this.isSidebarCollapsed = this.store.select(sidebarCollapsedSelector);
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
            this.scopeObject = this.communityService.findById(this.scope);
          } else {
            this.scopeObject = undefined;
          }
        }
      );
  }

  private updateSearchResults(searchOptions) {
    // Resolve search results
    this.results = this.service.search(this.query, this.scope, searchOptions);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public toggle(): void {
    this.store.dispatch(new SearchSidebarToggleAction());
  }
}
