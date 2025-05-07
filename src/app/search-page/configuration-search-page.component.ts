import {
  AsyncPipe,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BuildConfig } from 'src/config/build-config.interface';

import { APP_CONFIG } from '../../config/app-config.interface';
import { SearchManager } from '../core/browse/search-manager';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { RouteService } from '../core/services/route.service';
import { SearchService } from '../core/shared/search/search.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-configuration.service';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { ItemExportModalLauncherComponent } from '../shared/search/item-export/item-export-modal-launcher/item-export-modal-launcher.component';
import { SearchComponent } from '../shared/search/search.component';
import { SearchChartsComponent } from '../shared/search/search-charts/search-charts.component';
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
    NgIf,
    NgTemplateOutlet,
    PageWithSidebarComponent,
    ThemedSearchFormComponent,
    ThemedSearchResultsComponent,
    ThemedSearchSidebarComponent,
    TranslateModule,
    SearchLabelsComponent,
    ViewModeSwitchComponent,
    NgbTooltipModule,
    ItemExportModalLauncherComponent,
    SearchChartsComponent,
  ],
})

export class ConfigurationSearchPageComponent extends SearchComponent {
  constructor(@Inject(PLATFORM_ID) public platformId: any,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              @Inject(APP_CONFIG) protected appConfig: BuildConfig,
              protected service: SearchService,
              protected searchManager: SearchManager,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              protected routeService: RouteService,
              protected router: Router,
              protected authorizationService: AuthorizationDataService,
  ) {
    super(platformId, searchConfigService, appConfig, service, searchManager, sidebarService, windowService, routeService, router, authorizationService);
  }
}
