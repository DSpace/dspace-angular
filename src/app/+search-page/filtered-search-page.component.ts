import { HostWindowService } from '../shared/host-window.service';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { SearchPageComponent } from './search-page.component';
import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { RouteService } from '../shared/services/route.service';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { Observable } from 'rxjs';
import { PaginatedSearchOptions } from './paginated-search-options.model';
import { SEARCH_CONFIG_SERVICE } from '../+my-dspace-page/my-dspace-page.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({selector: 'ds-filtered-search-page',
  styleUrls: ['./search-page.component.scss'],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

export class FilteredSearchPageComponent extends SearchPageComponent {

  /**
   * The actual query for the fixed filter.
   * If empty, the query will be determined by the route parameter called 'filter'
   */
  @Input() fixedFilterQuery: string;

  constructor(protected service: SearchService,
              protected sidebarService: SearchSidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService) {
    super(service, sidebarService, windowService, searchConfigService, routeService);
  }

  /**
   * Get the current paginated search options after updating the fixed filter using the fixedFilterQuery input
   * This is to make sure the fixed filter is included in the paginated search options, as it is not part of any
   * query or route parameters
   * @returns {Observable<PaginatedSearchOptions>}
   */
  protected getSearchOptions(): Observable<PaginatedSearchOptions> {
    this.searchConfigService.updateFixedFilter(this.fixedFilterQuery);
    return this.searchConfigService.paginatedSearchOptions;
  }

}
