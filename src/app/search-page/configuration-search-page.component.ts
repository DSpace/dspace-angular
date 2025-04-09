import { HostWindowService } from '../shared/host-window.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SearchComponent } from '../shared/search/search.component';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { RouteService } from '../core/services/route.service';
import { SearchService } from '../core/shared/search/search.service';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../../config/app-config.interface';
import { SearchManager } from '../core/browse/search-manager';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { BuildConfig } from '../../config/build-config.interface';

/**
 * This component renders a search page using a configuration as input.
 */
@Component({
  selector: 'ds-configuration-search-page',
  styleUrls: ['../shared/search/search.component.scss'],
  templateUrl: '../shared/search/search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

export class ConfigurationSearchPageComponent extends SearchComponent {
  constructor(protected service: SearchService,
              protected searchManager: SearchManager,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected router: Router,
              @Inject(APP_CONFIG) protected appConfig: BuildConfig,
              @Inject(PLATFORM_ID) public platformId: any,
              protected authorizationService: AuthorizationDataService,
  ) {
    super(service, searchManager, sidebarService, windowService, searchConfigService, routeService, router, appConfig, platformId, authorizationService);
  }
}
