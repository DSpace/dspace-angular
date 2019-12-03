import { HostWindowService } from '../shared/host-window.service';
import { SearchService } from '../core/shared/search/search.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SearchComponent } from './search.component';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../+my-dspace-page/my-dspace-page.component';
import { Router } from '@angular/router';
import { hasValue } from '../shared/empty.util';
import { RouteService } from '../core/services/route.service';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-filtered-search-page',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

export class FilteredSearchPageComponent extends SearchComponent implements OnInit {
  /**
   * The actual query for the fixed filter.
   * If empty, the query will be determined by the route parameter called 'fixedFilterQuery'
   */
  @Input() fixedFilterQuery: string;

  constructor(protected service: SearchService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected router: Router) {
    super(service, sidebarService, windowService, searchConfigService, routeService, router);
  }

  /**
   * Listening to changes in the paginated search options
   * If something changes, update the search results
   *
   * Listen to changes in the scope
   * If something changes, update the list of scopes for the dropdown
   */
  ngOnInit(): void {
    super.ngOnInit();
    if (hasValue(this.fixedFilterQuery)) {
      this.routeService.setParameter('fixedFilterQuery', this.fixedFilterQuery);
    }
  }
}
