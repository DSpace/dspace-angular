import { Component, Inject, OnInit } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { filter, map, switchMap } from 'rxjs/operators';
import { SearchComponent } from './search.component';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { HostWindowService } from '../shared/host-window.service';
import { SEARCH_CONFIG_SERVICE } from '../+my-dspace-page/my-dspace-page.component';
import { RouteService } from '../core/services/route.service';
import { hasValue } from '../shared/empty.util';
import { SearchSuccessResponse } from '../core/cache/response.models';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SearchService } from '../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchQueryResponse } from '../shared/search/search-query-response.model';
import { Router } from '@angular/router';

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
export class SearchTrackerComponent extends SearchComponent implements OnInit {

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
    // super.ngOnInit();
    this.getSearchOptions().pipe(
      switchMap((options) => this.service.searchEntries(options)
        .pipe(
          filter((entry) =>
            hasValue(entry.requestEntry)
            && hasValue(entry.requestEntry.response)
            && entry.requestEntry.response.isSuccessful === true
          ),
          map((entry) => ({
            searchOptions: entry.searchOptions,
            response: (entry.requestEntry.response as SearchSuccessResponse).results
          })),
        )
      )
    )
      .subscribe((entry) => {
        const config: PaginatedSearchOptions = entry.searchOptions;
        const searchQueryResponse: SearchQueryResponse = entry.response;
        const filters: Array<{ filter: string, operator: string, value: string, label: string; }> = [];
        const appliedFilters = searchQueryResponse.appliedFilters || [];
        for (let i = 0, filtersLength = appliedFilters.length; i < filtersLength; i++) {
          const appliedFilter = appliedFilters[i];
          filters.push(appliedFilter);
        }
        this.angulartics2.eventTrack.next({
          action: 'search',
          properties: {
            searchOptions: config,
            page: {
              size: config.pagination.size, // same as searchQueryResponse.page.elementsPerPage
              totalElements: searchQueryResponse.page.totalElements,
              totalPages: searchQueryResponse.page.totalPages,
              number: config.pagination.currentPage, // same as searchQueryResponse.page.currentPage
            },
            sort: {
              by: config.sort.field,
              order: config.sort.direction
            },
            filters: filters,
          },
        })
      });
  }
}
