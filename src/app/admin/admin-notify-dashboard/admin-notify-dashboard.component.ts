import { Component, Inject, OnInit } from '@angular/core';
import { SearchConfigurationService } from "../../core/shared/search/search-configuration.service";
import { SearchService } from "../../core/shared/search/search.service";
import { PaginatedSearchOptions } from "../../shared/search/models/paginated-search-options.model";
import { SEARCH_CONFIG_SERVICE } from "../../my-dspace-page/my-dspace-page.component";
import { PaginationComponentOptions } from "../../shared/pagination/pagination-component-options.model";
import { SearchFilterConfig } from "../../shared/search/models/search-filter-config.model";

@Component({
  selector: 'ds-admin-notify-dashboard',
  templateUrl: './admin-notify-dashboard.component.html',
  styleUrls: ['./admin-notify-dashboard.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class AdminNotifyDashboardComponent implements OnInit{
  mockFilterConfig : SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    type: {
      value: "discovery-filter"
    },
    pageSize: 10,
    name: "author",
    filterType: "text",
    _links: {
      self: {
        href: "https://dspace-coar.4science.cloud/server/api/discover/facets/author"
      }
    }
  });

  mockPaginatedSearchOptions = new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), { id: 'page-id', currentPage: 1, pageSize: 20 }),
    configuration: '',
  });

  constructor(private searchService: SearchService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
  ) {}

  ngOnInit() {
    this.searchService.getFacetValuesFor(this.mockFilterConfig, 1, this.mockPaginatedSearchOptions).subscribe(c => console.log(c))
  }
}
