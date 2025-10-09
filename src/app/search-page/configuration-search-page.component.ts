import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  APP_CONFIG,
  AppConfig,
} from '../../config/app-config.interface';
import { RouteService } from '../core/services/route.service';
import { SearchService } from '../core/shared/search/search.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-configuration.service';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SearchComponent } from '../shared/search/search.component';
import { SearchLabelsComponent } from '../shared/search/search-labels/search-labels.component';
import { ThemedSearchResultsComponent } from '../shared/search/search-results/themed-search-results.component';
import { ThemedSearchSidebarComponent } from '../shared/search/search-sidebar/themed-search-sidebar.component';
import { ThemedSearchFormComponent } from '../shared/search-form/themed-search-form.component';
import { PageWithSidebarComponent } from '../shared/sidebar/page-with-sidebar.component';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { ViewModeSwitchComponent } from '../shared/view-mode-switch/view-mode-switch.component';

/**
 * This component renders a search page using a configuration as input.
 */
@Component({
  selector: 'ds-base-configuration-search-page',
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
  standalone: true,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    PageWithSidebarComponent,
    SearchLabelsComponent,
    ThemedSearchFormComponent,
    ThemedSearchResultsComponent,
    ThemedSearchSidebarComponent,
    TranslateModule,
    ViewModeSwitchComponent,
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
              @Inject(PLATFORM_ID) public platformId: any,
  ) {
    super(service, sidebarService, windowService, searchConfigService, routeService, router, appConfig, platformId);
  }
}
