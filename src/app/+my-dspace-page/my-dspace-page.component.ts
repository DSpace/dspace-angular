import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, switchMap, tap, } from 'rxjs/operators';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { PaginatedSearchOptions } from '../+search-page/paginated-search-options.model';
import { SearchFilterService } from '../+search-page/search-filters/search-filter/search-filter.service';
import { SearchService } from '../+search-page/search-service/search.service';
import { SearchSidebarService } from '../+search-page/search-sidebar/search-sidebar.service';
import { hasValue } from '../shared/empty.util';
import { getSucceededRemoteData } from '../core/shared/operators';
import { MyDSpaceResult } from './my-dspace-result.model';
import { MyDSpaceResponseParsingService } from '../core/data/mydspace-response-parsing.service';
import { SearchConfigurationOption } from '../+search-page/search-switch-configuration/search-configuration-option.model';
import { RoleType } from '../core/roles/role-types';
import { SearchConfigurationService } from '../+search-page/search-service/search-configuration.service';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { SearchFilterConfig } from '../+search-page/search-service/search-filter-config.model';

export const MYDSPACE_ROUTE = '/mydspace';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-my-dspace-page',
  styleUrls: ['./my-dspace-page.component.scss'],
  templateUrl: './my-dspace-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut]
})

/**
 * This component represents the whole mydspace page
 */
export class MyDSpacePageComponent implements OnInit {

  /**
   * The list of available configuration options
   */
  configurationList$: Observable<SearchConfigurationOption[]>;

  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<MyDSpaceResult<DSpaceObject>>>> = new BehaviorSubject(null);

  /**
   * The current paginated search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  /**
   * The current relevant scopes
   */
  scopeListRD$: Observable<DSpaceObject[]>;

  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;

  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;

  roleTypeEnum = RoleType;

  constructor(private service: SearchService,
              private sidebarService: SearchSidebarService,
              private windowService: HostWindowService,
              private filterService: SearchFilterService,
              private configurationService: MyDSpaceConfigurationService,
              private searchConfigService: SearchConfigurationService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.service.setServiceOptions(MyDSpaceResponseParsingService, true);
  }

  /**
   * Listening to changes in the paginated search options
   * If something changes, update the search results
   *
   * Listen to changes in the scope
   * If something changes, update the list of scopes for the dropdown
   */
  ngOnInit(): void {
    this.configurationList$ = this.configurationService.getAvailableConfigurationOptions();

    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.sub = this.searchOptions$.pipe(
      switchMap((options) => this.service.search(options).pipe(getSucceededRemoteData())))
      .subscribe((results) => {
        this.resultsRD$.next(results);
      });
    this.scopeListRD$ = this.searchConfigService.getCurrentScope('').pipe(
      switchMap((scopeId) => this.service.getScopes(scopeId))
    );

  }

  /**
   * Set the sidebar to a collapsed state
   */
  public closeSidebar(): void {
    this.sidebarService.collapse()
  }

  /**
   * Set the sidebar to an expanded state
   */
  public openSidebar(): void {
    this.sidebarService.expand();
  }

  /**
   * Check if the sidebar is collapsed
   * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
   */
  public isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  /**
   * @returns {string} The base path to the search page
   */
  public getSearchLink(): string {
    return this.service.getSearchLink();
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
