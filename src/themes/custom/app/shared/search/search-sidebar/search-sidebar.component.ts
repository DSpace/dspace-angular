/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE_ATMIRE and NOTICE_ATMIRE files at the root of the source
 * tree and available online at
 *
 * https://www.atmire.com/software-license/
 */
import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SearchConfigurationService } from '../../../../../../app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../app/my-dspace-page/my-dspace-configuration.service';
import { AdvancedSearchComponent } from '../../../../../../app/shared/search/advanced-search/advanced-search.component';
import { ThemedSearchFiltersComponent } from '../../../../../../app/shared/search/search-filters/themed-search-filters.component';
import { ThemedSearchSettingsComponent } from '../../../../../../app/shared/search/search-settings/themed-search-settings.component';
import { SearchSidebarComponent as BaseComponent } from '../../../../../../app/shared/search/search-sidebar/search-sidebar.component';
import { SearchSwitchConfigurationComponent } from '../../../../../../app/shared/search/search-switch-configuration/search-switch-configuration.component';
import { ViewModeSwitchComponent } from '../../../../../../app/shared/view-mode-switch/view-mode-switch.component';


@Component({
  selector: 'ds-themed-search-sidebar',
  // styleUrls: ['./search-sidebar.component.scss'],
  styleUrls: ['../../../../../../app/shared/search/search-sidebar/search-sidebar.component.scss'],
  // templateUrl: './search-sidebar.component.html',
  templateUrl: '../../../../../../app/shared/search/search-sidebar/search-sidebar.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [NgIf, ViewModeSwitchComponent, SearchSwitchConfigurationComponent, ThemedSearchFiltersComponent, ThemedSearchSettingsComponent, TranslateModule, AdvancedSearchComponent, AsyncPipe],
})
export class SearchSidebarComponent extends BaseComponent {
}
