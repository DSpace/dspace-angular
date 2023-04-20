import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { SearchComponent } from './search.component';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { HostWindowService } from '../shared/host-window.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { RouteService } from '../core/services/route.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SearchService } from '../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchObjects } from '../shared/search/search-objects.model';
import { NavigationStart, Router } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { getFirstSucceededRemoteData } from '../core/shared/operators';
import { inspect } from 'util';
import { hasValue, hasValueOperator, isNotEmpty } from '../shared/empty.util';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';
import { ITEM_MODULE_PATH } from '../item-page/item-page-routing-paths';
import { COLLECTION_MODULE_PATH } from '../collection-page/collection-page-routing-paths';
import { COMMUNITY_MODULE_PATH } from '../community-page/community-page-routing-paths';

/**
 * This component triggers a page view statistic
 */
@Component({
  selector: 'ds-search-tracker',
  styleUrls: ['./search-tracker.component.scss'],
  templateUrl: './search-tracker.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class SearchTrackerComponent extends SearchComponent implements OnInit, OnDestroy {
  /**
   * Regex to match UUIDs
   */
  uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g;

  /**
   * List of paths that are considered to be the start of a route to an object page (excluding "/", e.g. "items")
   * These are expected to end on an object UUID
   * If they match the route we're navigating to, an object property will be added to the search event sent
   */
  allowedObjectPaths: string[] = ['entities', ITEM_MODULE_PATH, COLLECTION_MODULE_PATH, COMMUNITY_MODULE_PATH];

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  subs: Subscription[] = [];

  constructor(
    protected service: SearchService,
    protected sidebarService: SidebarService,
    protected windowService: HostWindowService,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
    protected routeService: RouteService,
    public angulartics2: Angulartics2,
    protected router: Router
  ) {
    super(service, sidebarService, windowService, searchConfigService, routeService, router);
  }

  ngOnInit(): void {
    this.subs.push(
      this.getSearchOptionsAndObjects().subscribe((options) => {
        this.trackEvent(this.transformOptionsToEventProperties(options));
      }),
      this.router.events.pipe(
        filter((event) => event instanceof NavigationStart),
        map((event: NavigationStart) => this.getDsoUUIDFromUrl(event.url)),
        hasValueOperator(),
        switchMap((uuid) =>
          this.getSearchOptionsAndObjects().pipe(
            take(1),
            map((options) => this.transformOptionsToEventProperties(Object.assign({}, options, {
              object: uuid,
            })))
          )
        ),
      ).subscribe((options) => {
        this.trackEvent(options);
      }),
    );
  }

  /**
   * Get a combination of the currently applied search options and search query response
   */
  getSearchOptionsAndObjects(): Observable<{ config: PaginatedSearchOptions, searchQueryResponse: SearchObjects<DSpaceObject> }> {
    return this.getSearchOptions().pipe(
      switchMap((options: PaginatedSearchOptions) =>
        this.service.searchEntries(options).pipe(
          getFirstSucceededRemoteData(),
          map((rd: RemoteData<SearchObjects<DSpaceObject>>) => ({
            config: options,
            searchQueryResponse: rd.payload
          }))
        )
      ),
    );
  }

  /**
   * Transform the given options containing search-options, query-response and optional object UUID into properties
   * that can be sent to Angularitics for triggering a search event
   * @param options
   */
  transformOptionsToEventProperties(options: { config: PaginatedSearchOptions, searchQueryResponse: SearchObjects<DSpaceObject>, object?: string }): any {
    const filters: { filter: string, operator: string, value: string, label: string; }[] = [];
    const appliedFilters = options.searchQueryResponse.appliedFilters || [];
    for (let i = 0, filtersLength = appliedFilters.length; i < filtersLength; i++) {
      const appliedFilter = appliedFilters[i];
      filters.push(appliedFilter);
    }
    return {
      action: 'search',
      properties: {
        searchOptions: options.config,
        page: {
          size: options.config.pagination.size, // same as searchQueryResponse.page.elementsPerPage
          totalElements: options.searchQueryResponse.pageInfo.totalElements,
          totalPages: options.searchQueryResponse.pageInfo.totalPages,
          number: options.config.pagination.currentPage, // same as searchQueryResponse.page.currentPage
        },
        sort: {
          by: options.config.sort.field,
          order: options.config.sort.direction
        },
        filters: filters,
        object: options.object,
      },
    };
  }

  /**
   * Track an event with given properties
   * @param properties
   */
  trackEvent(properties: any) {
    this.angulartics2.eventTrack.next(properties);
  }

  /**
   * Get the UUID from a DSO url
   * Return null if the url isn't an object page (allowedObjectPaths) or the UUID couldn't be found
   * @param url
   */
  getDsoUUIDFromUrl(url: string): string {
    if (isNotEmpty(url)) {
      if (this.allowedObjectPaths.some((path) => url.startsWith(`/${path}`))) {
        const uuid = url.substring(url.lastIndexOf('/') + 1);
        if (uuid.match(this.uuidRegex)) {
          return uuid;
        }
      }
    }
    return null;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
