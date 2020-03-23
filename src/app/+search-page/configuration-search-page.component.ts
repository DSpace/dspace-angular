import { switchMap } from 'rxjs/operators';
import { HostWindowService } from '../shared/host-window.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SearchComponent } from './search.component';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { SEARCH_CONFIG_SERVICE } from '../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { hasValue } from '../shared/empty.util';
import { RouteService } from '../core/services/route.service';
import { SearchService } from '../core/shared/search/search.service';
import { Router } from '@angular/router';

/**
 * This component renders a search page using a configuration as input.
 */
@Component({
  selector: 'ds-configuration-search-page',
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

export class ConfigurationSearchPageComponent extends SearchComponent implements OnInit {
  /**
   * The configuration to use for the search options
   * If empty, the configuration will be determined by the route parameter called 'configuration'
   */
  @Input() configuration: string;

  /**
   * The actual query for the fixed filter.
   * If empty, the query will be determined by the route parameter called 'filter'
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
    if (hasValue(this.configuration)) {
      this.routeService.setParameter('configuration', this.configuration);
    }
    if (hasValue(this.fixedFilterQuery)) {
      this.routeService.setParameter('fixedFilterQuery', this.fixedFilterQuery);
    }
  }
}
