import { HostWindowService } from '../shared/host-window.service';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { SearchPageComponent } from './search-page.component';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { RouteService } from '../shared/services/route.service';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { Observable } from 'rxjs/Observable';
import { PaginatedSearchOptions } from './paginated-search-options.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({selector: 'ds-filtered-search-page',
  styleUrls: ['./search-page.component.scss'],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut]
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
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService,
              protected routeService: RouteService) {
    super(service, sidebarService, windowService, filterService, searchConfigService, routeService);
  }

  protected getSearchOptions(): Observable<PaginatedSearchOptions> {
    this.searchConfigService.updateFixedFilter(this.fixedFilterQuery);
    return this.searchConfigService.paginatedSearchOptions;
  }

}
