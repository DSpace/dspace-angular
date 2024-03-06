import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';

import { RouteService } from '../core/services/route.service';
import { SearchService } from '../core/shared/search/search.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SearchComponent } from '../shared/search/search.component';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { APP_CONFIG, AppConfig } from '../../config/app-config.interface';

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
      useClass: SearchConfigurationService,
    },
  ],
})

export class ConfigurationSearchPageComponent extends SearchComponent {
  constructor(protected service: SearchService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected router: Router,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(service, sidebarService, windowService, searchConfigService, routeService, router, appConfig);
  }
}
