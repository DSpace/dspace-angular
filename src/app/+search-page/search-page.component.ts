import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { isNotEmpty } from '../shared/empty.util';
import { HostWindowService } from '../shared/host-window.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchOptions, ViewMode } from './search-options.model';
import { SearchResult } from './search-result.model';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';

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
  resultsRDObs: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;
  currentParams = {};
  searchOptions: SearchOptions;
  sortConfig: SortOptions;
  scopeListRDObs: Observable<RemoteData<PaginatedList<Community>>>;
  isMobileView: Observable<boolean>;
  pageSize;
  pageSizeOptions;
  defaults = {
    pagination: {
      id: 'search-results-pagination',
      pageSize: 10
    },
    query: ''
  };

  constructor(private service: SearchService,
              private communityService: CommunityDataService,
              private sidebarService: SearchSidebarService,
              private windowService: HostWindowService,
              private filterService: SearchFilterService) {
    this.isMobileView = Observable.combineLatest(
      this.windowService.isXs(),
      this.windowService.isSm(),
      ((isXs, isSm) => isXs || isSm)
    );
    this.scopeListRDObs = communityService.findAll();
  }

  ngOnInit(): void {
    this.sub = this.filterService.getPaginatedSearchOptions(this.defaults).subscribe((options) => {
      this.updateSearchResults(options);
    });
  }

  private updateSearchResults(searchOptions) {
    this.resultsRDObs = this.service.search(searchOptions);
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
