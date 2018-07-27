import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { flatMap, } from 'rxjs/operators';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { PaginatedSearchOptions } from './paginated-search-options.model';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';
import { SearchResult } from './search-result.model';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../shared/empty.util';

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
export class SearchPageComponent implements OnInit {

  resultsRD$: Subject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new Subject();
  searchOptions$: Observable<PaginatedSearchOptions>;
  sortConfig: SortOptions;
  scopeListRD$: Observable<DSpaceObject[]>;
  isXsOrSm$: Observable<boolean>;
  pageSize;
  pageSizeOptions;
  defaults = {
    pagination: {
      id: 'search-results-pagination',
      pageSize: 10
    },
    sort: new SortOptions('score', SortDirection.DESC),
    query: '',
    scope: ''
  };
  sub: Subscription;

  constructor(private service: SearchService,
              private sidebarService: SearchSidebarService,
              private windowService: HostWindowService,
              private filterService: SearchFilterService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  ngOnInit(): void {
    this.searchOptions$ = this.filterService.getPaginatedSearchOptions(this.defaults);
    this.sub = this.searchOptions$.subscribe((searchOptions) =>
      this.service.search(searchOptions).first().subscribe((results) => this.resultsRD$.next(results))
    );

    this.scopeListRD$ = this.filterService.getCurrentScope().pipe(
      flatMap((scopeId) => this.service.getScopes(scopeId))
    );
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

  public getSearchLink(): string {
    return this.service.getSearchLink();
  }

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
