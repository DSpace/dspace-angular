import { AsyncPipe } from '@angular/common';
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
  imports: [
    AdvancedSearchComponent,
    AsyncPipe,
    SearchSwitchConfigurationComponent,
    ThemedSearchFiltersComponent,
    ThemedSearchSettingsComponent,
    TranslateModule,
    ViewModeSwitchComponent,
  ],
})
export class SearchSidebarComponent extends BaseComponent {
}
